<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use App\Models\WorkEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $startOfWeek = $now->copy()->startOfWeek();
        $today = $now->copy()->startOfDay();

        $query = WorkEntry::query();
        
        // Apply department filter for non-admin users
        if (!$user->canViewAllDepartments()) {
            $query->where('department_id', $user->department_id);
        }

        $stats = [];

        if ($user->isAdmin()) {
            $stats['totalUsers'] = User::count();
            $stats['totalDepartments'] = Department::where('is_active', true)->count();
            $stats['activeUsers'] = User::where('is_active', true)->count();
            $stats['totalEntries'] = WorkEntry::whereBetween('work_date', [$startOfMonth, $endOfMonth])->count();
        } elseif ($user->isCTO()) {
            $stats['totalHours'] = $query->clone()
                ->whereBetween('work_date', [$startOfMonth, $endOfMonth])
                ->sum('hours_spent');
            $stats['totalEntries'] = $query->clone()
                ->whereBetween('work_date', [$startOfMonth, $endOfMonth])
                ->count();
            $stats['activeDepartments'] = Department::where('is_active', true)->count();
            $stats['completedTasks'] = $query->clone()
                ->whereBetween('work_date', [$startOfMonth, $endOfMonth])
                ->whereHas('status', function ($q) {
                    $q->where('is_final', true);
                })
                ->count();
        } else {
            // Department Owner stats
            $stats['todayHours'] = $query->clone()
                ->where('user_id', $user->id)
                ->whereDate('work_date', $today)
                ->sum('hours_spent');
            $stats['weekHours'] = $query->clone()
                ->where('user_id', $user->id)
                ->whereBetween('work_date', [$startOfWeek, $now])
                ->sum('hours_spent');
            $stats['monthEntries'] = $query->clone()
                ->where('user_id', $user->id)
                ->whereBetween('work_date', [$startOfMonth, $endOfMonth])
                ->count();
            $stats['pendingTasks'] = $query->clone()
                ->where('user_id', $user->id)
                ->whereHas('status', function ($q) {
                    $q->where('is_final', false);
                })
                ->count();
        }

        return response()->json($stats);
    }

    public function recentActivities(Request $request)
    {
        $query = WorkEntry::with(['user', 'department', 'workType', 'status'])
            ->forUser($request->user())
            ->latest('work_date')
            ->latest('created_at')
            ->limit(10);

        $activities = $query->get();

        return response()->json($activities);
    }

    public function chartData(Request $request)
    {
        $user = $request->user();
        $days = $request->get('days', 30);
        $startDate = Carbon::now()->subDays($days);
        $endDate = Carbon::now();

        $query = WorkEntry::whereBetween('work_date', [$startDate, $endDate]);

        if (!$user->canViewAllDepartments()) {
            $query->where('department_id', $user->department_id);
        }

        // Daily trend data
        $dailyTrend = $query->clone()
            ->select(
                DB::raw('DATE(work_date) as date'),
                DB::raw('COUNT(*) as entries'),
                DB::raw('SUM(hours_spent) as hours')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Fill in missing dates
        $trendData = [];
        $currentDate = $startDate->copy();
        
        while ($currentDate <= $endDate) {
            $dateStr = $currentDate->format('Y-m-d');
            $dayData = $dailyTrend->firstWhere('date', $dateStr);
            
            $trendData[] = [
                'date' => $dateStr,
                'entries' => $dayData ? $dayData->entries : 0,
                'hours' => $dayData ? $dayData->hours : 0,
            ];
            
            $currentDate->addDay();
        }

        return response()->json([
            'trend' => $trendData,
            'period' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ]
        ]);
    }
}
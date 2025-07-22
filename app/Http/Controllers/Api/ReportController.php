<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\WorkEntriesExport;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function monthly(Request $request)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $month = Carbon::parse($request->month);
        $startDate = $month->copy()->startOfMonth();
        $endDate = $month->copy()->endOfMonth();

        $query = WorkEntry::with(['user', 'department', 'workType', 'status'])
            ->whereBetween('work_date', [$startDate, $endDate]);

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if (!$request->user()->canViewAllDepartments()) {
            $query->where('department_id', $request->user()->department_id);
        }

        $entries = $query->orderBy('work_date')->get();

        $summary = [
            'total_entries' => $entries->count(),
            'total_hours' => $entries->sum('hours_spent'),
            'by_user' => $entries->groupBy('user_id')->map(function ($group) {
                return [
                    'user' => $group->first()->user,
                    'entries' => $group->count(),
                    'hours' => $group->sum('hours_spent'),
                ];
            }),
            'by_work_type' => $entries->groupBy('work_type_id')->map(function ($group) {
                return [
                    'work_type' => $group->first()->workType,
                    'entries' => $group->count(),
                    'hours' => $group->sum('hours_spent'),
                ];
            }),
            'by_status' => $entries->groupBy('status_id')->map(function ($group) {
                return [
                    'status' => $group->first()->status,
                    'count' => $group->count(),
                ];
            }),
        ];

        return response()->json([
            'period' => $month->format('F Y'),
            'entries' => $entries,
            'summary' => $summary,
        ]);
    }

    public function kpi(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $query = WorkEntry::whereBetween('work_date', [$request->date_from, $request->date_to])
            ->whereNotNull('kpi_metrics');

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if (!$request->user()->canViewAllDepartments()) {
            $query->where('department_id', $request->user()->department_id);
        }

        $entries = $query->with(['user', 'department'])->get();

        // Aggregate KPI metrics
        $kpiData = [];
        foreach ($entries as $entry) {
            if ($entry->kpi_metrics) {
                foreach ($entry->kpi_metrics as $key => $value) {
                    if (!isset($kpiData[$key])) {
                        $kpiData[$key] = [
                            'total' => 0,
                            'count' => 0,
                            'values' => [],
                        ];
                    }
                    $kpiData[$key]['total'] += $value;
                    $kpiData[$key]['count']++;
                    $kpiData[$key]['values'][] = $value;
                }
            }
        }

        // Calculate averages and other statistics
        $kpiSummary = [];
        foreach ($kpiData as $metric => $data) {
            $kpiSummary[$metric] = [
                'average' => $data['count'] > 0 ? round($data['total'] / $data['count'], 2) : 0,
                'total' => $data['total'],
                'min' => min($data['values']),
                'max' => max($data['values']),
                'count' => $data['count'],
            ];
        }

        return response()->json([
            'period' => [
                'from' => $request->date_from,
                'to' => $request->date_to,
            ],
            'kpi_metrics' => $kpiSummary,
            'entries_with_kpi' => $entries->count(),
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'format' => 'required|in:xlsx,pdf',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
        ]);

        $query = WorkEntry::with(['user', 'department', 'workType', 'status'])
            ->whereBetween('work_date', [$request->date_from, $request->date_to]);

        if (!$request->user()->canViewAllDepartments()) {
            $query->where('department_id', $request->user()->department_id);
        }

        $entries = $query->orderBy('work_date')->get();

        if ($request->format === 'xlsx') {
            return Excel::download(new WorkEntriesExport($entries), 'work-entries.xlsx');
        } else {
            $pdf = Pdf::loadView('reports.work-entries', compact('entries'));
            return $pdf->download('work-entries.pdf');
        }
    }
}
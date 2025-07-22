<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkEntry;
use App\Models\WorkEntryAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class WorkEntryController extends Controller
{
    public function index(Request $request)
    {
        try {
            Log::info('WorkEntry index called', [
                'user' => $request->user()->email,
                'filters' => $request->all()
            ]);

            $query = WorkEntry::with(['user', 'department', 'workType', 'status']);

            // Apply user department filtering if not admin/CTO
            if (!$request->user()->canViewAllDepartments()) {
                $query->where('department_id', $request->user()->department_id);
            }

            // Apply filters
            if ($request->filled('date_from')) {
                $query->where('work_date', '>=', $request->date_from);
            }

            if ($request->filled('date_to')) {
                $query->where('work_date', '<=', $request->date_to);
            }

            if ($request->filled('department_id')) {
                $query->where('department_id', $request->department_id);
            }

            if ($request->filled('work_type_id')) {
                $query->where('work_type_id', $request->work_type_id);
            }

            if ($request->filled('status_id')) {
                $query->where('status_id', $request->status_id);
            }

            if ($request->filled('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $entries = $query->orderBy('work_date', 'desc')
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 20));

            return response()->json($entries);
        } catch (\Exception $e) {
            Log::error('Error in WorkEntry index', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error fetching work entries',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            Log::info('WorkEntry store called', [
                'user' => $request->user()->email,
                'data' => $request->all()
            ]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'work_date' => 'required|date|date_format:Y-m-d|before_or_equal:today',
                'hours_spent' => 'required|integer|min:0|max:24',
                'department_id' => 'required|exists:departments,id',
                'work_type_id' => 'required|exists:work_types,id',
                'status_id' => 'required|exists:statuses,id',
                'location' => 'nullable|string|max:255',
                'tags' => 'nullable|array',
                'tags.*' => 'string|max:50',
                'kpi_metrics' => 'nullable|array',
            ]);

            // Add user_id from authenticated user
            $validated['user_id'] = $request->user()->id;

            // Ensure work_date is properly formatted
            if (isset($validated['work_date'])) {
                $validated['work_date'] = Carbon::parse($validated['work_date'])->format('Y-m-d');
            }

            // If user is not admin/CTO, force their department_id
            if (!$request->user()->canViewAllDepartments()) {
                $validated['department_id'] = $request->user()->department_id;
            }

            // Create the work entry
            $workEntry = WorkEntry::create($validated);

            DB::commit();

            // Load relationships for response
            $workEntry->load(['user', 'department', 'workType', 'status']);

            Log::info('WorkEntry created successfully', ['id' => $workEntry->id]);

            return response()->json($workEntry, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Validation error in WorkEntry store', [
                'errors' => $e->errors()
            ]);
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in WorkEntry store', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error creating work entry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            Log::info('WorkEntry show called', ['id' => $id]);

            $workEntry = WorkEntry::with(['user', 'department', 'workType', 'status', 'attachments'])
                ->findOrFail($id);

            // Check if user can view this entry
            if (!$this->userCanView($workEntry)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            return response()->json($workEntry);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('WorkEntry not found', ['id' => $id]);
            return response()->json(['message' => 'Work entry not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error in WorkEntry show', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error fetching work entry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            Log::info('WorkEntry update called', [
                'id' => $id,
                'user' => $request->user()->email,
                'data' => $request->all()
            ]);

            $workEntry = WorkEntry::findOrFail($id);

            // Check if user can update this entry
            if (!$this->userCanUpdate($workEntry)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'department_id' => 'sometimes|exists:departments,id',
                'work_type_id' => 'sometimes|exists:work_types,id',
                'status_id' => 'sometimes|exists:statuses,id',
                'work_date' => 'sometimes|date|date_format:Y-m-d',
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'hours_spent' => 'sometimes|integer|min:0|max:24',
                'kpi_metrics' => 'nullable|array',
                'location' => 'nullable|string|max:255',
                'tags' => 'nullable|array',
            ]);

            // Ensure work_date is properly formatted if provided
            if (isset($validated['work_date'])) {
                $validated['work_date'] = Carbon::parse($validated['work_date'])->format('Y-m-d');
            }

            $workEntry->update($validated);

            return response()->json(
                $workEntry->load(['user', 'department', 'workType', 'status', 'attachments'])
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Work entry not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error in WorkEntry update', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error updating work entry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            Log::info('WorkEntry destroy called', ['id' => $id]);

            $workEntry = WorkEntry::findOrFail($id);

            // Check if user can delete this entry
            if (!$this->userCanDelete($workEntry)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Delete attachments
            foreach ($workEntry->attachments as $attachment) {
                Storage::disk('public')->delete($attachment->file_path);
                $attachment->delete();
            }

            $workEntry->delete();
            DB::commit();

            return response()->json(['message' => 'Work entry deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Work entry not found'], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in WorkEntry destroy', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error deleting work entry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Helper methods for authorization
    private function userCanView($workEntry)
    {
        $user = request()->user();

        // Admin and CTO can view all
        if ($user->canViewAllDepartments()) {
            return true;
        }

        // Users can view entries from their department
        return $user->department_id === $workEntry->department_id;
    }

    private function userCanUpdate($workEntry)
    {
        $user = request()->user();

        // Admin can update any entry
        if ($user->role === 'admin') {
            return true;
        }

        // Users can update their own entries
        return $user->id === $workEntry->user_id;
    }

    private function userCanDelete($workEntry)
    {
        $user = request()->user();

        // Admin can delete any entry
        if ($user->role === 'admin') {
            return true;
        }

        // Users can delete their own entries
        return $user->id === $workEntry->user_id;
    }

    public function summary(Request $request)
    {
        try {
            $request->validate([
                'date_from' => 'required|date',
                'date_to' => 'required|date|after_or_equal:date_from',
            ]);

            $query = WorkEntry::query();

            // Apply department filter if not admin/CTO
            if (!$request->user()->canViewAllDepartments()) {
                $query->where('department_id', $request->user()->department_id);
            }

            $query->whereBetween('work_date', [$request->date_from, $request->date_to]);

            $summary = [
                'total_entries' => $query->count(),
                'total_hours' => $query->sum('hours_spent'),
                'by_department' => $query->clone()
                    ->select('department_id', DB::raw('COUNT(*) as count'), DB::raw('SUM(hours_spent) as hours'))
                    ->with('department')
                    ->groupBy('department_id')
                    ->get(),
                'by_work_type' => $query->clone()
                    ->select('work_type_id', DB::raw('COUNT(*) as count'), DB::raw('SUM(hours_spent) as hours'))
                    ->with('workType')
                    ->groupBy('work_type_id')
                    ->get(),
                'by_status' => $query->clone()
                    ->select('status_id', DB::raw('COUNT(*) as count'))
                    ->with('status')
                    ->groupBy('status_id')
                    ->get(),
            ];

            return response()->json($summary);
        } catch (\Exception $e) {
            Log::error('Error in WorkEntry summary', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error generating summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Add this method to handle attachment uploads
    public function uploadAttachments(Request $request, $id)
    {
        try {
            $workEntry = WorkEntry::findOrFail($id);

            // Check if user can update this entry
            if (!$this->userCanUpdate($workEntry)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $request->validate([
                'attachments' => 'required|array',
                'attachments.*' => 'file|max:10240' // 10MB max
            ]);

            $uploadedFiles = [];

            foreach ($request->file('attachments') as $file) {
                $path = $file->store('work-entries/' . $id, 'public');

                $attachment = $workEntry->attachments()->create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType()
                ]);

                $uploadedFiles[] = $attachment;
            }

            return response()->json(['attachments' => $uploadedFiles]);
        } catch (\Exception $e) {
            Log::error('Error uploading attachments', [
                'work_entry_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Error uploading attachments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteAttachment($workEntryId, $attachmentId)
    {
        try {
            $workEntry = WorkEntry::findOrFail($workEntryId);
            $attachment = WorkEntryAttachment::findOrFail($attachmentId);

            // Verify the attachment belongs to this work entry
            if ($attachment->work_entry_id != $workEntry->id) {
                return response()->json(['message' => 'Attachment not found'], 404);
            }

            // Check if user can update this entry
            if (!$this->userCanUpdate($workEntry)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Delete the file from storage
            Storage::disk('public')->delete($attachment->file_path);

            // Delete the database record
            $attachment->delete();

            return response()->json(['message' => 'Attachment deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting attachment', [
                'work_entry_id' => $workEntryId,
                'attachment_id' => $attachmentId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Error deleting attachment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

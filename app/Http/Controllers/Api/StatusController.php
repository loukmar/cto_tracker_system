<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Status;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function index()
    {
        $statuses = Status::orderBy('order')
            ->orderBy('name')
            ->get();
            
        return response()->json($statuses);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
            'order' => 'nullable|integer',
            'is_final' => 'nullable|boolean',
        ]);

        $status = Status::create($validated);

        return response()->json($status, 201);
    }

    public function show(Status $status)
    {
        return response()->json($status);
    }

    public function update(Request $request, Status $status)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'color' => 'nullable|string|max:7',
            'order' => 'nullable|integer',
            'is_final' => 'nullable|boolean',
        ]);

        $status->update($validated);

        return response()->json($status);
    }

    public function destroy(Request $request, Status $status)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        if ($status->workEntries()->exists()) {
            return response()->json([
                'message' => 'Cannot delete status with existing entries'
            ], 422);
        }

        $status->delete();

        return response()->json(['message' => 'Status deleted successfully']);
    }
}
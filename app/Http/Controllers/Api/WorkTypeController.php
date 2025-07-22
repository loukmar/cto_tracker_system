<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkType;
use Illuminate\Http\Request;

class WorkTypeController extends Controller
{
    public function index()
    {
        $workTypes = WorkType::orderBy('order')
            ->orderBy('name')
            ->get();
            
        return response()->json($workTypes);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
            'order' => 'nullable|integer',
        ]);

        $workType = WorkType::create($validated);

        return response()->json($workType, 201);
    }

    public function show(WorkType $workType)
    {
        return response()->json($workType);
    }

    public function update(Request $request, WorkType $workType)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        $workType->update($validated);

        return response()->json($workType);
    }

    public function destroy(Request $request, WorkType $workType)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        if ($workType->workEntries()->exists()) {
            return response()->json([
                'message' => 'Cannot delete work type with existing entries'
            ], 422);
        }

        $workType->delete();

        return response()->json(['message' => 'Work type deleted successfully']);
    }
}
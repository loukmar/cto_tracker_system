<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::orderBy('name')->get();
        return response()->json($departments);
    }

    public function store(Request $request)
    {
        // Check if user is admin
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:departments',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        $department = Department::create($validated);

        return response()->json($department, 201);
    }

    public function show(Department $department)
    {
        return response()->json($department);
    }

    public function update(Request $request, Department $department)
    {
        // Check if user is admin
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:10|unique:departments,code,' . $department->id,
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'is_active' => 'sometimes|boolean',
        ]);

        $department->update($validated);

        return response()->json($department);
    }

    public function destroy(Request $request, Department $department)
    {
        // Check if user is admin
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Check if department has users or work entries
        if ($department->users()->exists()) {
            return response()->json([
                'message' => 'Cannot delete department with existing users'
            ], 422);
        }

        if ($department->workEntries()->exists()) {
            return response()->json([
                'message' => 'Cannot delete department with existing work entries'
            ], 422);
        }

        $department->delete();

        return response()->json(['message' => 'Department deleted successfully']);
    }
}
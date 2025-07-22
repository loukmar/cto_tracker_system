<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;


class UserController extends Controller
{
    public function index(Request $request)
    {
        try {
            Log::info('User index called', [
                'user' => $request->user()->email,
                'filters' => $request->all()
            ]);

            $query = User::with('department');

            // Apply filters
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            if ($request->filled('role')) {
                $query->where('role', $request->role);
            }

            if ($request->filled('department_id')) {
                $query->where('department_id', $request->department_id);
            }

            if ($request->filled('is_active')) {
                $query->where('is_active', $request->is_active);
            }

            // If not admin/CTO, only show users from their department
            if (!in_array($request->user()->role, ['admin', 'cto'])) {
                $query->where('department_id', $request->user()->department_id);
            }

            $users = $query->orderBy('name')
                ->paginate($request->get('per_page', 20));

            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Error in User index', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error fetching users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('User store called', [
                'creating_user' => $request->user()->email,
                'data' => $request->except('password')
            ]);

            // Only admins can create users
            if ($request->user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => ['required', Rule::in(['admin', 'cto', 'department_owner'])],
                'department_id' => 'required|exists:departments,id',
                'phone' => 'nullable|string|max:20',
                'is_active' => 'boolean',
            ]);

            $validated['password'] = Hash::make($validated['password']);
            $validated['is_active'] = $validated['is_active'] ?? true;

            $user = User::create($validated);

            return response()->json($user->load('department'), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error in User store', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error creating user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            Log::info('User show called', ['id' => $id]);

            $user = User::with(['department', 'workEntries' => function ($query) {
                $query->latest()->limit(10);
            }])->findOrFail($id);

            // Check if user can view this user
            if (!$this->userCanViewUser($user)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            return response()->json($user);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'User not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error in User show', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Error fetching user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
                'phone' => 'nullable|string|max:20',
                'current_password' => 'required_with:new_password',
                'new_password' => 'nullable|string|min:8|confirmed',
            ]);

            // Check current password if changing password
            if ($request->filled('new_password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json([
                        'message' => 'Current password is incorrect'
                    ], 422);
                }
                $validated['password'] = Hash::make($request->new_password);
            }

            // Remove password fields from validated data
            unset($validated['current_password']);
            unset($validated['new_password']);
            unset($validated['new_password_confirmation']);

            $user->update($validated);

            return response()->json($user->load('department'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating profile', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Error updating profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload user avatar
     */
    public function uploadAvatar(Request $request)
    {
        try {
            $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg|max:2048'
            ]);

            $user = $request->user();

            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Store new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');

            $user->update(['avatar' => $avatarPath]);

            return response()->json([
                'avatar' => $avatarPath,
                'avatar_url' => asset('storage/' . $avatarPath)
            ]);
        } catch (\Exception $e) {
            Log::error('Error uploading avatar', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Error uploading avatar',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function destroy($id)
    {
        try {
            Log::info('User destroy called', [
                'id' => $id,
                'deleting_user' => request()->user()->email
            ]);

            $user = User::findOrFail($id);

            // Check if user can delete this user
            if (!$this->userCanDeleteUser($user)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Cannot delete yourself
            if (request()->user()->id == $user->id) {
                return response()->json(['message' => 'You cannot delete your own account'], 422);
            }

            $user->delete();

            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'User not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error in User destroy', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Error deleting user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Helper methods for authorization
    private function userCanViewUser($targetUser)
    {
        $currentUser = request()->user();

        // Users can view their own profile
        if ($currentUser->id === $targetUser->id) {
            return true;
        }

        // Admin and CTO can view all users
        if (in_array($currentUser->role, ['admin', 'cto'])) {
            return true;
        }

        // Department owners can view users in their department
        return $currentUser->department_id === $targetUser->department_id;
    }

    private function userCanUpdateUser($targetUser)
    {
        $currentUser = request()->user();

        // Users can update their own profile
        if ($currentUser->id === $targetUser->id) {
            return true;
        }

        // Only admins can update other users
        return $currentUser->role === 'admin';
    }

    private function userCanDeleteUser($targetUser)
    {
        $currentUser = request()->user();

        // Cannot delete yourself
        if ($currentUser->id === $targetUser->id) {
            return false;
        }

        // Only admins can delete users
        return $currentUser->role === 'admin';
    }
}

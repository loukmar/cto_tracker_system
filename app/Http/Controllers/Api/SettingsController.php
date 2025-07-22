<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;


class SettingsController extends Controller
{
    /**
     * Get all settings (protected route)
     */
    public function index(Request $request)
    {
        try {
            // Only admins can access settings
            if ($request->user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $settings = Settings::all()->pluck('value', 'key')->toArray();
            return response()->json($settings);
        } catch (\Exception $e) {
            Log::error('Error fetching settings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error fetching settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get public settings (for login page, etc.)
     */
    public function publicSettings()
    {
        try {
            $publicKeys = ['site_name', 'site_logo', 'site_description'];
            $settings = Settings::whereIn('key', $publicKeys)->pluck('value', 'key')->toArray();

            // Set defaults if not found
            $settings['site_name'] = $settings['site_name'] ?? 'CTO Tracking System';

            return response()->json($settings);
        } catch (\Exception $e) {
            Log::error('Error fetching public settings', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'site_name' => 'CTO Tracking System'
            ]);
        }
    }

    /**
     * Update settings
     */
    public function store(Request $request)
    {
        // Only admins can update settings
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'site_name' => 'required|string|max:255',
            'site_description' => 'nullable|string|max:500',
            'site_email' => 'nullable|email|max:255',
            'timezone' => 'required|string',
            'date_format' => 'required|string',
            'time_format' => 'required|string',
            'week_starts_on' => 'required|in:sunday,monday',
            'site_logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        try {
            // Handle logo upload
            if ($request->hasFile('site_logo')) {
                $oldLogo = Settings::where('key', 'site_logo')->first();

                // Delete old logo if exists
                if ($oldLogo && $oldLogo->value) {
                    Storage::disk('public')->delete($oldLogo->value);
                }

                // Store new logo
                $logoPath = $request->file('site_logo')->store('logos', 'public');
                Settings::updateOrCreate(
                    ['key' => 'site_logo'],
                    ['value' => $logoPath]
                );
            }

            // Update other settings
            $settings = $request->except(['site_logo']);

            foreach ($settings as $key => $value) {
                Settings::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
            }

            // Clear settings cache
            Cache::forget('app_settings');

            return response()->json(['message' => 'Settings updated successfully']);
        } catch (\Exception $e) {
            Log::error('Error updating settings', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Error updating settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove logo
     */
    public function removeLogo(Request $request)
    {
        // Only admins can update settings
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $logo = Settings::where('key', 'site_logo')->first();

            if ($logo && $logo->value) {
                Storage::disk('public')->delete($logo->value);
                $logo->delete();
            }

            Cache::forget('app_settings');

            return response()->json(['message' => 'Logo removed successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error removing logo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

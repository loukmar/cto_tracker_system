<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\WorkTypeController;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\WorkEntryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SettingsController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/settings/public', [SettingsController::class, 'publicSettings']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Profile routes
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::post('/profile/avatar', [UserController::class, 'uploadAvatar']);

    // Settings routes (admin only)
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::post('/settings', [SettingsController::class, 'store']);
    Route::delete('/settings/logo', [SettingsController::class, 'removeLogo']);

    // IMPORTANT: Specific routes MUST come BEFORE resource routes

    // Work entry specific routes - BEFORE apiResource
    Route::get('/work-entries/summary', [WorkEntryController::class, 'summary']);
    Route::post('/work-entries/{id}/attachments', [WorkEntryController::class, 'uploadAttachments']);
    Route::delete('/work-entries/{workEntryId}/attachments/{attachmentId}', [WorkEntryController::class, 'deleteAttachment']);

    // Dashboard routes
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/activities', [DashboardController::class, 'recentActivities']);
    Route::get('/dashboard/charts', [DashboardController::class, 'chartData']);

    // Reports routes
    Route::get('/reports/monthly', [ReportController::class, 'monthly']);
    Route::get('/reports/kpi', [ReportController::class, 'kpi']);
    Route::get('/reports/export', [ReportController::class, 'export']);

    // Resource routes - These come AFTER specific routes
    Route::apiResource('users', UserController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('work-types', WorkTypeController::class);
    Route::apiResource('statuses', StatusController::class);
    Route::apiResource('work-entries', WorkEntryController::class);
});

// API Resource routes (alternative approach - cleaner)
// You can replace the individual routes above with these resource routes:
/*
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('work-types', WorkTypeController::class);
    Route::apiResource('statuses', StatusController::class);
    Route::apiResource('work-entries', WorkEntryController::class);
});
*/
<?php

use Illuminate\Support\Facades\Route;

Route::get('/test-login', function () {
    return view('test-login');
});

Route::get('/debug', function () {
    return view('debug');
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
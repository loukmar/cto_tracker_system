<?php

use Illuminate\Support\Facades\Route;

$routes = Route::getRoutes();
echo "API Routes:\n";
foreach ($routes as $route) {
    if (str_starts_with($route->uri(), 'api/')) {
        echo $route->methods()[0] . " " . $route->uri() . "\n";
    }
}

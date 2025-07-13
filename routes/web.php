<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ModuleController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});




Route::prefix('admin')->name('admin.')->group(function () {
    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('courses', CourseController::class)->except(['show']);
});

// Custom module routes for a course
Route::get('/admin/modules', [ModuleController::class, 'index'])->name('admin.modules.index');
Route::post('/admin/course/{course}/module/add', [ModuleController::class, 'store'])->name('admin.modules.store');
Route::put('/admin/course/{course}/module/{module}', [ModuleController::class, 'update'])->name('admin.modules.update');
Route::delete('/admin/course/{course}/module/{module}', [ModuleController::class, 'destroy'])->name('admin.modules.destroy');




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

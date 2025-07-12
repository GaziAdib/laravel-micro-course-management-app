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

    // Custom module routes for a course
    Route::get('course/modules', [ModuleController::class, 'index'])->name('courses.modules.index');
    Route::post('course/{course}/module/add', [ModuleController::class, 'store'])->name('courses.modules.store');
    Route::put('course/{course}/module/{module}', [ModuleController::class, 'update'])->name('courses.modules.update');
    Route::delete('course/{course}/module/{module}', [ModuleController::class, 'destroy'])->name('courses.modules.destroy');

});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

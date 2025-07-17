<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserCourseController;

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


// Custom Lessons routes for a course
Route::get('/admin/lessons', [LessonController::class, 'index'])->name('admin.lessons.index');
Route::post('/admin/{module}/lesson/add', [LessonController::class, 'store'])->name('admin.lessons.store');
Route::put('/admin/{module}/lesson/{lesson}', [LessonController::class, 'update'])->name('admin.lesons.update');
Route::delete('/admin/{module}/lesson/{lesson}', [LessonController::class, 'destroy'])->name('admin.lessons.destroy');


Route::middleware(['auth'])->prefix('user')->group(function() {
    Route::get('/courses', [UserCourseController::class, 'index'])->name('user.courses.index');
    Route::get('/courses/{course}', [UserCourseController::class, 'show'])->name('user.courses.show');
});


Route::middleware(['auth'])->prefix('user')->group(function() {
    Route::get('/courses/{course}/reviews', [ReviewController::class, 'showReviews'])->name('user.reviews.show');
    Route::post('/courses/{course}/review/add', [ReviewController::class, 'store'])->name('user.reviews.store');
    Route::put('/courses/{course}/review/{review}', [ReviewController::class, 'update'])->name('user.reviews.update');
    Route::delete('/courses/{course}/review/{review}', [ReviewController::class, 'destroy'])->name('user.reviews.destroy');
});

Route::middleware(['auth'])->prefix('user')->group(function() {
  Route::get('/carts', [UserCourseController::class, 'showCarts'])->name('carts.index');
});






require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

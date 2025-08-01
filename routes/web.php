<?php

use App\Http\Controllers\AdminDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserCartController;
use App\Http\Controllers\UserCheckoutController;
use App\Http\Controllers\UserCouponController;
use App\Http\Controllers\UserCourseController;
use App\Http\Controllers\UserPurchaseController;
use App\Http\Controllers\UserQuizProgressController;
use Illuminate\Http\Request;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});



Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('courses', CourseController::class)->except(['show']);
});

// Custom module routes for a course
Route::get('/admin/modules', [ModuleController::class, 'index'])->middleware(['auth', 'admin'])->name('admin.modules.index');
Route::post('/admin/course/{course}/module/add', [ModuleController::class, 'store'])->middleware(['auth', 'admin'])->name('admin.modules.store');
Route::put('/admin/course/{course}/module/{module}', [ModuleController::class, 'update'])->middleware(['auth', 'admin'])->name('admin.modules.update');
Route::delete('/admin/course/{course}/module/{module}', [ModuleController::class, 'destroy'])->middleware(['auth', 'admin'])->name('admin.modules.destroy');


// Custom Lessons routes for a course
Route::get('/admin/lessons', [LessonController::class, 'index'])->middleware(['auth', 'admin'])->name('admin.lessons.index');
Route::post('/admin/{module}/lesson/add', [LessonController::class, 'store'])->middleware(['auth', 'admin'])->name('admin.lessons.store');
Route::put('/admin/{module}/lesson/{lesson}', [LessonController::class, 'update'])->middleware(['auth', 'admin'])->name('admin.lesons.update');
Route::delete('/admin/{module}/lesson/{lesson}', [LessonController::class, 'destroy'])->middleware(['auth', 'admin'])->name('admin.lessons.destroy');


// any user auth auth and purchased a course can add review
Route::middleware('auth')->prefix('user')->group(function () {
    Route::get('/courses/{course}/reviews', [ReviewController::class, 'showReviews'])->name('user.reviews.show');
    Route::post('/courses/{course}/review/add', [ReviewController::class, 'store'])->name('user.reviews.store');
    Route::put('/courses/{course}/review/{review}', [ReviewController::class, 'update'])->name('user.reviews.update');
    Route::delete('/courses/{course}/review/{review}', [ReviewController::class, 'destroy'])->name('user.reviews.destroy');
});



// Admin & moderator only
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/purchases', [PurchaseController::class, 'adminShowAllPurchases'])->name('admin.purchases.index');
    Route::put('/purchases/{purchase}/update', [PurchaseController::class, 'changeStatus'])->name('admin.purchases.update');
    Route::delete('/purchases/{purchase}/delete', [PurchaseController::class, 'destroyPurchase'])->name('admin.purchases.destroy');
});



// Admin & moderator Dashboard Data

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/analytics', [AdminDashboardController::class, 'analytics'])->name('admin.analytics.index');
});


// Admin & modeator Add Quiz

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/quizzess', [QuizController::class, 'index'])->name('admin.quizzes.index');
    Route::post('/{module}/add-quiz', [QuizController::class, 'store'])->name('admin.quiz.add');
    Route::put('/{module}/update-quiz/{quiz}', [QuizController::class, 'update'])->name('admin.quiz.update');
    Route::delete('/{module}/delete-quiz/{quiz}', [QuizController::class, 'destroy'])->name('admin.quiz.delete');
});


// Admin & moderator Add Questions
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/questions', [QuestionController::class, 'index'])->name('admin.questions.index');
    Route::post('/{quiz}/add-question', [QuestionController::class, 'store'])->name('admin.question.add');
    Route::put('/{quiz}/update-question/{question}', [QuestionController::class, 'update'])->name('admin.question.update');
    Route::delete('/{quiz}/delete-question/{question}', [QuestionController::class, 'destroy'])->name('admin.question.delete');
});




// admin and moderator handle coupon system

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/coupons', [CouponController::class, 'index'])->name('admin.coupons.index');
    Route::post('/add-coupon', [CouponController::class, 'store'])->name('admin.coupons.add');
    Route::put('/update-coupon/{coupon}', [CouponController::class, 'update'])->name('admin.coupons.update');
    Route::delete('/delete-coupon/{coupon}', [CouponController::class, 'destroy'])->name('admin.coupons.delete');
});



// all users can see courses index and detail of course
Route::middleware('auth')->prefix('user')->group(function () {
    Route::get('/courses', [UserCourseController::class, 'index'])->name('user.courses.index');
    Route::get('/courses/{course}', [UserCourseController::class, 'show'])->name('user.courses.show');
    Route::get('/{course}/classroom', [UserCourseController::class, 'userCourseClassroom'])->name('user.course.classroom.index');
});




// User Course Purchases and make purchases
Route::middleware('auth')->prefix('user')->group(function () {
    Route::get('/purchases', [UserPurchaseController::class, 'showUserPurchases'])->name('user.purchases.index');
    Route::post('/checkouts/store', [UserPurchaseController::class, 'purchaseCourse'])->name('checkout.store');
});



// user see carts,
Route::middleware('auth')->prefix('user')->group(function () {
    Route::get('/carts', [UserCartController::class, 'showCarts'])->name('carts.index');
});

 // user manage checkouts
Route::middleware('auth')->prefix('user')->group(function () {
    Route::get('/checkouts', [UserCheckoutController::class, 'showCheckouts'])->name('checkouts.index');
});



// user apply for coupon
Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/user/courses/{course}/apply-coupon', [UserCouponController::class, 'applyCoupon'])
        ->name('user.apply.coupon');

    Route::get('/debug-coupon', function (Request $request) {
        return response()->json([
            'coupon' => $request->session()->get('applied_coupon')
        ]);
    });
});


// all users can see courses index and detail of course
Route::middleware('auth')->prefix('user')->group(function () {
    Route::post('/course-progress/store-or-update', [UserQuizProgressController::class, 'storeOrUpdateUserCourseProgress'])
    ->name('user.course.progress.store_or_update');
    //Route::post('/course-progress/create', [UserQuizProgressController::class, 'storeUserCourseProgress'])->name('user.course.progress.store');
    //Route::put('/course-progress/update/{quizProgress}', [UserQuizProgressController::class, 'updateUserCourseProgress'])->name('user.course.progress.update');
});






require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

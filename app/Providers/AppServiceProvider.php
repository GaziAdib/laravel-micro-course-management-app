<?php

namespace App\Providers;

use App\Models\Course;
use App\Models\Purchase;
use App\Models\Review;
use App\Policies\CoursePolicy;
use App\Policies\PurchasePolicy;
use App\Policies\ReviewPolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{


    protected $policies = [
        Purchase::class => PurchasePolicy::class,
        Review::class => ReviewPolicy::class,
        Course::class => CoursePolicy::class
    ];


    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {


        Model::automaticallyEagerLoadRelationships();

        Inertia::share([
            'applied_coupon' => fn () => session('applied_coupon'),
            'flash' => fn () => [
                'success' => session('success'),
                'error' => session('error')
            ],
        ]);

    }
}

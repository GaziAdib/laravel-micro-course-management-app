<?php

namespace App\Providers;

use App\Models\Purchase;
use App\Models\Review;
use App\Policies\PurchasePolicy;
use App\Policies\ReviewPolicy;
use Illuminate\Support\ServiceProvider;


class AppServiceProvider extends ServiceProvider
{


    protected $policies = [
        Purchase::class => PurchasePolicy::class,
        Review::class => ReviewPolicy::class
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

        //  // Global before hook - grants super admins all permissions
        // Gate::before(function ($user, $ability) {
        //     if ($user->role === 'admin') {
        //         return true;
        //     }
        // });

        // Gate::define('changeStatus', function ($user) {
        //     return $user->role === 'admin' || $user->role === 'moderator';
        // });
    }
}

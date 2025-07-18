<?php

namespace App\Providers;

use App\Models\Purchase;
use App\Policies\PurchasePolicy;
use Illuminate\Support\ServiceProvider;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */

    protected $policies = [
        Purchase::class => PurchasePolicy::class,
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

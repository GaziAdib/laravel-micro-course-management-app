<?php

namespace App\Http\Controllers;

use App\Services\AdminDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\Log;


class AdminDashboardController extends Controller
{
    protected AdminDashboardService $adminDashboardService;

    public function __construct(AdminDashboardService $adminDashboardService)
    {
        $this->adminDashboardService = $adminDashboardService;
    }

    public function analytics()
    {
        try {

            $courses = $this->adminDashboardService->adminShowAllCourses();
            $categories = $this->adminDashboardService->adminShowAllCategories();
            $modules = $this->adminDashboardService->adminShowAllModules();
            $lessons = $this->adminDashboardService->adminShowAllLessons();
            $purchases = $this->adminDashboardService->adminShowAllPurchases();
            $reviews = $this->adminDashboardService->adminShowAllReviews();


            return Inertia::render('admin/analytics/Index', [  // Note consistent capitalization
                'categories' => $categories,
                'courses' => $courses,
                'modules' => $modules,
                'lessons' => $lessons,  // Fixed typo (make sure this matches your frontend)
                'purchases' => $purchases,
                'reviews' => $reviews
            ]);


        } catch (\Throwable $e) {
            Log::error('Dashboard Error: ' . $e->getMessage());
            return back()->with('error', 'Failed to load dashboard data');
        }
    }
}

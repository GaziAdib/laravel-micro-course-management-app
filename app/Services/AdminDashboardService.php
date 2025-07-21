<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Purchase;
use App\Models\Review;

class AdminDashboardService
{
    public function adminShowAllCourses()
    {
       return Course::with(['reviews', 'modules', 'lessons'])->get();
    }

    public function adminShowAllCategories()
    {
        return Category::withCount('courses')->get();
    }

    public function adminShowAllModules()
    {
        return Module::withCount('lessons')->get();
    }

    public function adminShowAllLessons()
    {
        return Lesson::all();
    }

    public function adminShowAllPurchases()
    {
        return Purchase::all();
    }

    public function adminShowAllReviews()
    {
        return Review::all();
    }
}

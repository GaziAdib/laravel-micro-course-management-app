<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Course;
use Illuminate\Contracts\Pagination\Paginator;

class CourseService
{
    public function paginateCourses(int $perPage = 10): Paginator
    {
        return Course::with(['category', 'reviews.user'])
            ->withCount('reviews')
            ->latest()
            ->paginate($perPage);
    }

    public function createCourse(array $data): Course
    {
        return Course::create($data);
    }

    public function updateCourse(int $id, array $data): bool
    {
        return Course::findOrFail($id)->update($data);
    }

    public function deleteCourse(int $id): bool
    {
        return Course::findOrFail($id)->delete();
    }

    public function getAllCategories()
    {
        return Category::all();
    }
}

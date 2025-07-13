<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserCourseController extends Controller
{

    public function index(Request $request)
    {


        $courses = Course::with(['modules', 'category', 'reviews'])->paginate(10);

        return Inertia::render('user/courses', [
            'courses' => $courses,
            'filters' => $request->only(['search', 'sort', 'category'])
        ]);
    }


    public function show(Course $courseId)
    {

        $course = Course::where('id', $courseId)->where('is_published', true)->with(['category', 'reviews.user'])->paginate(10);

        return Inertia::render('user/courses', [
            'course' => $course
        ]);
    }
}

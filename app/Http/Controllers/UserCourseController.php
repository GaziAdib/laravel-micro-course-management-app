<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserCourseController extends Controller
{

    public function index(Request $request)
    {

        $courses = Course::with(['modules', 'category', 'reviews'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->sort, function ($query, $sort) {
                match ($sort) {
                    'price-low' => $query->orderBy('price', 'asc'),
                    'price-high' => $query->orderBy('price', 'desc'),
                    default => $query->latest(),
                };
            })
            ->paginate(12);

        return Inertia::render('user/Courses/Index', [
            'courses' => $courses,
            'filters' => $request->only(['search', 'sort'])
        ]);
    }


    public function show($courseId)
    {

        $course = Course::with([
            'category',
            'modules' => function ($query) {
                $query->orderBy('order', 'asc')
                    ->with(['lessons' => function ($q) {
                        $q->orderBy('order', 'asc');
                    }]);
            },
            'reviews.user'
        ])
            ->findOrFail($courseId);


        return Inertia::render('user/Courses/Show/Show', [
            'course' => $course
        ]);
    }
}















// <?php

// namespace App\Http\Controllers;

// use App\Models\Course;
// use Illuminate\Http\Request;
// use Inertia\Inertia;

// class UserCourseController extends Controller
// {

//     public function index(Request $request)
//     {


//         // $courses = Course::with(['modules', 'category', 'reviews'])->paginate(10);

//         // return Inertia::render('user/courses', [
//         //     'courses' => $courses,
//         //     'filters' => $request->only(['search', 'sort', 'category'])
//         // ]);


//         $courses = Course::with(['modules', 'category', 'reviews'])
//             ->when($request->search, function ($query, $search) {
//                 $query->where(function ($q) use ($search) {
//                     $q->where('title', 'like', "%{$search}%")
//                         ->orWhere('description', 'like', "%{$search}%");
//                 });
//             })
//             ->when($request->sort, function ($query, $sort) {
//                 match ($sort) {
//                     'price-low' => $query->orderBy('price', 'asc'),
//                     'price-high' => $query->orderBy('price', 'desc'),
//                     default => $query->latest(),
//                 };
//             })
//             ->paginate(12); // Actually execute the query

//         // Remove the dd() to allow execution to continue
//         return Inertia::render('user/Courses/Index', [
//             'courses' => $courses,
//             'filters' => $request->only(['search', 'sort'])
//         ]);
//     }


//     public function show($courseId)
//     {

//         // $course = Course::where('id', $courseId)
//         // ->where('is_published', true)
//         // ->with(['category', 'reviews.user', 'modules'])
//         // ->firstOrFail();

//         // $course = Course::with(['category', 'modules.lessons', 'reviews.user'])
//         //         ->order
//         //         ->findOrFail($courseId);

//         // $course = Course::find($courseId);
//         // dd($course);

//         // dd($course);

//         $course = Course::with([
//             'category',
//             'modules' => function ($query) {
//                 $query->orderBy('order', 'asc')
//                     ->with(['lessons' => function ($q) {
//                         $q->orderBy('order', 'asc');
//                     }]);
//             },
//             'reviews.user'
//         ])
//             ->findOrFail($courseId);


//         return Inertia::render('user/Courses/Show/Show', [
//             'course' => $course
//         ]);
//     }
// }

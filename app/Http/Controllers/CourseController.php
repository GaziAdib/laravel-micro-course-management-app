<?php

namespace App\Http\Controllers;
use App\Services\CourseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    protected CourseService $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }


    public function index()
    {
        $courses = $this->courseService->paginateCourses(10);
        $categories = $this->courseService->getAllCategories();
        return Inertia::render('admin/courses', ['courses' => $courses, 'categories' => $categories]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:courses',
            'description' => 'required|string|max:2500',
            'price' => 'required|decimal:0,10000000',
            'duration' => 'required|string',
            'level' => 'required|in:beginner,intermediate,advanced',
            'category_id' => 'required|integer|exists:categories,id',

            // Boolean Fields
            'is_paid' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',

            // Nullable fields
            'tags' => 'nullable|array|max:10',
            'image_url' => 'nullable|url|max:255',
            'related_images' => 'nullable|array|max:10',
            'prerequisites' => 'nullable|array|max:10',
            'video_url' => 'nullable|url|max:255',

        ]);

        // Course::create($validated);

        $course = $this->courseService->createCourse($validated);


        return redirect()->route('admin.courses.index')
            ->with('success', 'New Course Added Successfully')
            ->with('data', $course);

        // return redirect()->route('admin.courses.index')
        // ->with('success', 'New Course Added Successfully');

    }

    // this one is for detail page of course
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:courses',
            'description' => 'required|string|max:2500',
            'price' => 'required|decimal:0,10000000',
            'duration' => 'required|string',
            'level' => 'required|in:beginner,intermediate,advanced',
            'category_id' => 'required|integer|exists:categories,id',

            // Boolean Fields
            'is_paid' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',

            // Nullable fields
            'tags' => 'nullable|array|max:10',
            'image_url' => 'nullable|url|max:255',
            'related_images' => 'nullable|array|max:10',
            'prerequisites' => 'nullable|array|max:10',
            'video_url' => 'nullable|url|max:255',

        ]);

        // $course->update($validated);
        $this->courseService->updateCourse($id, $validated);

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        // $course = Course::findOrFail($id);

        // $course->destroy($id);

        $this->courseService->deleteCourse($id);

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course Deleted Successfully');
    }
}

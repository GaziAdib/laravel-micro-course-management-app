<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::with(['category', 'reviews.user'])
                        ->withCount('reviews')
                        ->latest()
                        ->paginate(10);

        $categories = Category::all();
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

        Course::create($validated);

        return redirect()->route('admin.courses.index')
        ->with('success', 'New Course Added Successfully');
    }

    /**
     * Display the specified resource.
     */
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
    public function update(Request $request, string $id)
    {

        $course = Course::findOrFail($id);


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


        $course->update($validated);

        return redirect()->route('admin.courses.index')
        ->with('success', 'Course Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $course = Course::findOrFail($id);

        $course->destroy($id);

        return redirect()->route('admin.courses.index')
        ->with('success', 'Course Deleted Successfully');
    }
}

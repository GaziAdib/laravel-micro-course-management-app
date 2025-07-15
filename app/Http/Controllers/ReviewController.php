<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{

    protected ReviewService $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    // public function index()
    // {
    //     $reviews = $this->reviewService->paginateAllReviews(10);

    //     return Inertia::render('admin/categories', ['reviews' => $reviews]);
    // }

    public function showReviews($courseId)
    {
        $reviews = $this->reviewService->paginateUserReviews(10, $courseId);
        return Inertia::render('user/Courses/Show/Show', ['reviews' => $reviews]);
        //return Inertia::render('user/Courses/Show/Show', ['reviews' => $reviews]);
    }





    public function create() {}


    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
            'is_approved' => 'sometimes|boolean'
        ]);


        $this->reviewService->addReview($course->id, $validated);

        return redirect()->route('user.courses.show', $course->id)
            ->with('success', 'Review Added Successfully');
    }



    public function edit(string $id)
    {
        //
    }


    public function update(Request $request, Course $course, Review $review)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
            'is_approved' => 'sometimes|boolean',

        ]);


        $this->reviewService->updateReview($course->id, $review->id,  $validated);

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Review Updated Successfully');
    }


    public function destroy(Course $course, Review $review)
    {
        $this->reviewService->deleteReview($review->id, $course->id);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Module Deleted Successfully');
    }
}

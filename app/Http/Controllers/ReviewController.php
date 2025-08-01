<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class ReviewController extends Controller
{

    protected ReviewService $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }


    public function showReviews(Request $request, $courseId)
    {
        if (!$request->user()->can('view', Review::class)) {
            abort(Response::HTTP_FORBIDDEN);
        }
        $reviews = $this->reviewService->paginateUserReviews(10, $courseId);
        return Inertia::render('user/Courses/Show/Show', [
            'reviews' => $reviews,
            'can' => [
                'delete' => $request->user()->can('delete', Review::class),
            ]
        ]);
    }



    public function store(Request $request, Course $course)
    {

        if (!$request->user()->can('create', Review::class)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
            'is_approved' => 'sometimes|boolean'
        ]);


        $this->reviewService->addReview($course->id, $validated);

        return redirect()->route('user.courses.show', $course->id)
            ->with('success', 'Review Added Successfully');
    }




    public function update(Request $request, Course $course, Review $review)
    {

        if (!$request->user()->can('update', Review::class)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
            'is_approved' => 'sometimes|boolean',

        ]);


        $this->reviewService->updateReview($course->id, $review->id,  $validated);

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Review Updated Successfully');
    }


    public function destroy(Request $request, Course $course, Review $review)
    {

        if (!$request->user()->can('delete', $review)) {
            return redirect()->back()
                ->withErrors(['error' => 'Only Admin & Moderator Can Delete Any Review!'])
                ->withInput();
        }

        $this->reviewService->deleteReview($review->id, $course->id);

        return redirect()->route('user.courses.show', $review->course_id)
            ->with('success', 'Module Deleted Successfully');
    }
}

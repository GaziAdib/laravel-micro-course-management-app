<?php

namespace App\Services;

use App\Models\Review;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;

class ReviewService
{
    public function paginateAllReviews(int $perPage): Paginator
    {
        return Review::with('course')
            ->latest()
            ->paginate($perPage);
    }

    public function paginateUserReviews(int $perPage, $courseId): Paginator
    {
        return Review::with('course')
            ->where('course_id', $courseId)
            ->latest()
            ->paginate($perPage);
    }



    public function addReview(int $courseId, array $data): Review
    {
        #return Review::whereCourseId($courseId)->create($data);

        return Review::create([
            'course_id' => $courseId,
            'user_id' => Auth::id(),
            'rating' => $data['rating'],
            'content' => $data['content'],
            'is_approved' => $data['is_approved'] ?? true
        ]);
    }



    public function updateReview(int $courseId, int $id,  array $data): bool
    {
        return Review::whereId($id)
            ->whereCourseId($courseId)
            ->whereUserId(Auth::id())
            ->firstOrFail()
            ->update($data);

        #return Module::findOrFail($id)->update($data);
    }


    public function deleteReview(int $id, int $courseId): bool
    {

        return Review::whereId($id)
            ->whereCourseId($courseId)
            ->firstOrFail()
            ->delete();
    }
}

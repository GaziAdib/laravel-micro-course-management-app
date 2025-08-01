<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\Review;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class ReviewPolicy
{
    use HandlesAuthorization;

    /**
     * Allow all abilities to admin by default.
     */
    public function before(User $user, $ability)
    {
        if ($user->role === 'admin') {
            return true;
        }
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user): bool
    {
        return $user->role === 'user' || $user->role === 'admin' || $user->role === 'moderator';
    }

    /**
     * Determine whether the user can create models.
     */

    // CREATE Review can be done only via course purchasers, admin or modeator
    public function create(User $user): bool
    {
        return $user->purchases()->exists() || $user->role === 'admin' || $user->role === 'moderator';

        //return $user->purchases()->where('course_id', request('course_id'))->exists();
    }


    public function update(User $user, Review $review): bool
    {
        return $user->id ===  $review->user_id;
    }


    public function delete(User $user, Review $review): bool
    {
        return $user->id ===  $review->user_id || $user->role === 'admin' || $user->role === 'moderator';
        //return $user->id ===  $review->user_id || $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Review $review): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Review $review): bool
    {
        return $user->id ===  $review->user_id || $user->role === 'admin' || $user->role === 'moderator';
    }
}

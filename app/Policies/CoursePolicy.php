<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\Module;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;


class CoursePolicy
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


    public function view(User $user, Course $course): bool
    {
        if (!$course->is_paid) {
            return true;
        }

        if ($user->role === 'admin' || $user->role === 'moderator') {
            return true;
        }

        // For paid courses, check purchase
        return $this->hasPurchased($user, $course);
    }

    public function canViewFreeModule(User $user, Course $course, Module $module): bool
    {

        if (in_array($user->role, ['admin', 'moderator'])) {
            return true;
        }

        if ($user->role === 'user' && $course->is_paid && !$module->is_paid) {
            return true;
        }

        if ($this->hasPurchased($user, $course, $module)) {
            return true;
        }

        return false;
    }



    protected function hasPurchased(User $user, Course $course): bool
    {
        return Purchase::where('user_id', $user->id)
            ->whereHas('orderItems', function ($query) use ($course) {
                $query->where('course_data', 'like', '%"id":' . $course->id . '%');
            })
            ->exists();
    }


    public function access(User $user, Course $course): bool
    {
        return $this->view($user, $course);
    }
}

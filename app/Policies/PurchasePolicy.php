<?php

namespace App\Policies;

use App\Models\Purchase;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class PurchasePolicy
{
    use HandlesAuthorization;

    public function before(User $user, $ability)
    {
        if ($user->role === 'admin') {
            return true;
        }

        return null;
    }

     public function viewAny(User $user, Purchase $purchase): bool
    {
        return $user->id === $purchase->user_id || $user->role === 'admin' || $user->role === 'admin';
    }

    public function view(User $user): bool
    {
        // Only users with purchases can view the list

        return $user->purchases()->exists();
    }



    public function updateStatus(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'moderator';
    }

    public function delete(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function restore(User $user, Purchase $purchase): bool
    {
        return false;
    }

    public function forceDelete(User $user, Purchase $purchase): bool
    {
        return $user->role === 'admin';
    }
}

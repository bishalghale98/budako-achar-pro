<?php

namespace App\Policies;

use App\Models\PageImage;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PageImagePolicy
{
    use HandlesAuthorization;

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, PageImage $pageImage): bool
    {
        return $user->isAdmin();
    }
}

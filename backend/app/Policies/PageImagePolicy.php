<?php

namespace App\Policies;

use App\Models\PageImage;
use App\Models\User;

class PageImagePolicy
{
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, PageImage $pageImage): bool
    {
        return $user->isAdmin();
    }
}

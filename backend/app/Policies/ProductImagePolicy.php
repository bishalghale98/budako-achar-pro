<?php

namespace App\Policies;

use App\Models\ProductImage;
use App\Models\User;

class ProductImagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, ProductImage $productImage): bool
    {
        return $user->isAdmin() && $productImage->product->category_id !== null;
    }

    public function delete(User $user, ProductImage $productImage): bool
    {
        return $user->isAdmin();
    }

    public function setThumbnail(User $user, ProductImage $productImage): bool
    {
        return $user->isAdmin();
    }
}

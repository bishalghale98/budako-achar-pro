<?php

namespace App\Models;

use App\Enums\PageStatus;
use App\Traits\HasCuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'slug', 'short_description', 'content', 'status', 'created_by', 'seo_title', 'seo_description', 'canonical_url', 'published_at'])]
class Page extends Model
{
    use HasCuid, HasFactory;

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'status' => PageStatus::class,
            'published_at' => 'datetime',
        ];
    }
}

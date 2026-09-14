<?php

namespace App\Models;

use App\Traits\HasCuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['page_id', 'image_url', 'original_name', 'mime_type', 'size'])]
class PageImage extends Model
{
    use HasCuid, HasFactory;

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}

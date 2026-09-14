<?php

namespace App\Services;

use App\Enums\PageStatus;
use App\Models\Page;
use Illuminate\Support\Facades\DB;

class PageService
{
    public function create(array $data): Page
    {
        if (isset($data['status']) && $data['status'] === PageStatus::Published->value) {
            $data['published_at'] = now();
        }

        return Page::create($data);
    }

    public function update(Page $page, array $data): Page
    {
        if (array_key_exists('status', $data)) {
            $wasPublished = $page->status === PageStatus::Published;
            $isNowPublished = $data['status'] === PageStatus::Published->value
                || $data['status'] === PageStatus::Published;

            if (! $wasPublished && $isNowPublished) {
                $data['published_at'] = now();
            } elseif ($wasPublished && ! $isNowPublished) {
                $data['published_at'] = null;
            }
        }

        $page->update($data);

        return $page;
    }

    public function delete(Page $page): bool
    {
        $page->deleteImages();

        return $page->delete();
    }
}

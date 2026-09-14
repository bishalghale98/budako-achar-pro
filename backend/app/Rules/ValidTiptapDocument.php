<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidTiptapDocument implements ValidationRule
{
    private const BLOCK_TYPES = [
        'paragraph', 'heading', 'bulletList', 'orderedList',
        'listItem', 'blockquote', 'codeBlock', 'horizontalRule', 'image', 'hardBreak',
    ];

    private const MARK_TYPES = [
        'bold', 'italic', 'strike', 'underline', 'code', 'link',
    ];

    private const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

    private const CHILDREN_MAP = [
        'doc'         => 'blocks',
        'paragraph'   => 'inline',
        'heading'     => 'inline',
        'bulletList'  => 'listItems',
        'orderedList' => 'listItems',
        'listItem'    => 'paragraphs',
        'blockquote'  => 'paragraphs',
        'codeBlock'   => 'textOnly',
    ];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_array($value) || ($value['type'] ?? null) !== 'doc') {
            $fail("The {$attribute} must be a valid document.");
            return;
        }

        if (empty($value['content']) || ! is_array($value['content'])) {
            $fail("The {$attribute} must contain content.");
            return;
        }

        $this->validateChildren($value['content'], 'doc', $attribute, $fail);
    }

    private function validateChildren(array $children, string $parentType, string $path, Closure $fail): void
    {
        $allowed = self::CHILDREN_MAP[$parentType] ?? null;
        if ($allowed === null) {
            return;
        }

        foreach ($children as $i => $node) {
            $nodePath = "{$path}.content.{$i}";

            if (! is_array($node) || empty($node['type'])) {
                $fail("The {$nodePath} must be a valid node.");
                return;
            }

            $type = $node['type'];

            switch ($allowed) {
                case 'blocks':
                    if (! in_array($type, self::BLOCK_TYPES, true)) {
                        $fail("The {$nodePath} has an unsupported block type: {$type}.");
                        return;
                    }
                    break;
                case 'inline':
                    if ($type !== 'text' && $type !== 'hardBreak') {
                        $fail("The {$nodePath} must be text or hardBreak inside {$parentType}.");
                        return;
                    }
                    break;
                case 'listItems':
                    if ($type !== 'listItem') {
                        $fail("The {$nodePath} must be a listItem inside {$parentType}.");
                        return;
                    }
                    break;
                case 'paragraphs':
                    if ($type !== 'paragraph') {
                        $fail("The {$nodePath} must be a paragraph inside {$parentType}.");
                        return;
                    }
                    break;
                case 'textOnly':
                    if ($type !== 'text') {
                        $fail("The {$nodePath} must be text inside {$parentType}.");
                        return;
                    }
                    break;
            }

            $this->validateNode($node, $nodePath, $fail);

            if (! empty($node['content']) && is_array($node['content'])) {
                $this->validateChildren($node['content'], $type, $nodePath, $fail);
            }
        }
    }

    private function validateNode(array $node, string $path, Closure $fail): void
    {
        $type = $node['type'];
        $attrs = $node['attrs'] ?? [];

        switch ($type) {
            case 'heading':
                if (isset($attrs['level']) && ! in_array((int) $attrs['level'], range(1, 6), true)) {
                    $fail("The {$path} heading level must be 1-6.");
                    return;
                }
                if (isset($attrs['textAlign']) && ! in_array($attrs['textAlign'], ['left', 'center', 'right'], true)) {
                    $fail("The {$path} text alignment is invalid.");
                    return;
                }
                break;

            case 'paragraph':
                if (isset($attrs['textAlign']) && ! in_array($attrs['textAlign'], ['left', 'center', 'right'], true)) {
                    $fail("The {$path} text alignment is invalid.");
                    return;
                }
                break;

            case 'image':
                if (empty($attrs['src']) || ! $this->isPageImageUrl($attrs['src'])) {
                    $fail("The {$path} image source is invalid.");
                    return;
                }
                if (empty($attrs['alt']) || ! is_string($attrs['alt'])) {
                    $fail("The {$path} image must have alt text.");
                    return;
                }
                break;
        }

        if (! empty($node['marks']) && is_array($node['marks'])) {
            $this->validateMarks($node['marks'], $path, $fail);
        }
    }

    private function validateMarks(array $marks, string $path, Closure $fail): void
    {
        foreach ($marks as $i => $mark) {
            $markPath = "{$path}.marks.{$i}";

            if (! is_array($mark) || empty($mark['type'])) {
                $fail("The {$markPath} must be a valid mark.");
                return;
            }

            if (! in_array($mark['type'], self::MARK_TYPES, true)) {
                $fail("The {$markPath} has an unsupported mark type: {$mark['type']}.");
                return;
            }

            if ($mark['type'] === 'link') {
                $href = $mark['attrs']['href'] ?? null;
                if (! $href || ! $this->isSafeUrl($href)) {
                    $fail("The {$markPath} contains an unsafe URL.");
                    return;
                }
            }
        }
    }

    private function isPageImageUrl(string $url): bool
    {
        if (str_starts_with($url, '/storage/pages/')) {
            return true;
        }

        if (preg_match('#^https?://[^/]+/storage/pages/#', $url)) {
            return true;
        }

        return false;
    }

    private function isSafeUrl(string $url): bool
    {
        $lower = strtolower(trim($url));

        foreach (['javascript:', 'data:', 'vbscript:', 'file:'] as $dangerous) {
            if (str_starts_with($lower, $dangerous)) {
                return false;
            }
        }

        if (str_starts_with($url, '/') || str_starts_with($url, '#')) {
            return true;
        }

        foreach (self::SAFE_PROTOCOLS as $protocol) {
            if (str_starts_with($lower, $protocol)) {
                return true;
            }
        }

        return false;
    }
}

# Tiptap Rich Text Editor

Reusable Tiptap infrastructure for the Laravel + Next.js stack.

**Tiptap JSON is the single source of truth.** Everything revolves around that: editor outputs JSON, database stores JSON, API returns JSON, renderer consumes JSON.

---

## Quick Start

### Editor (Admin Form)

```tsx
"use client";

import { TiptapEditor, type TiptapDoc } from "@/components/shared/tiptap";

function MyForm() {
  const [content, setContent] = useState<TiptapDoc | null>(null);

  return (
    <TiptapEditor
      content={content}
      onChange={setContent}
      placeholder="Write something..."
    />
  );
}
```

### Read-Only Renderer (Public Page)

```tsx
import { TiptapContent, type TiptapDoc } from "@/components/shared/tiptap";

function ProductPage({ description }: { description: TiptapDoc | null }) {
  return <TiptapContent content={description} />;
}
```

### Empty Document Default

```tsx
import { emptyDoc } from "@/components/shared/tiptap";

const form = useForm({
  defaultValues: {
    description: emptyDoc,
  },
});
```

---

## Architecture

```
                    ADMIN
                      │
                      ▼
              React Hook Form
                      │
                      ▼
                TiptapEditor
                      │
                editor.getJSON()
                      │
                      ▼
                Zod Validation
                      │
                      ▼
                 RTK Query
                      │
              HTTP / JSON Request
                      │
                      ▼
              Laravel API
                      │
              Request Validation
                      │
                      ▼
                Eloquent Model
                      │
                      ▼
                JSON Column
```

Public side:

```
Laravel API
     │
     ▼
Tiptap JSON
     │
     ▼
TiptapContent
     │
     ▼
Rendered HTML
```

---

## Frontend

### Components

| Component | Purpose |
|-----------|---------|
| `TiptapEditor` | Interactive rich text editor |
| `TiptapToolbar` | Formatting toolbar (headings, bold, italic, etc.) |
| `TiptapContent` | Read-only renderer for public pages |
| `emptyDoc` | Empty Tiptap document for form defaults |
| `getDefaultExtensions()` | Returns configured extension array |

### Imports

```tsx
// From shared module
import {
  TiptapEditor,
  TiptapContent,
  emptyDoc,
  getDefaultExtensions,
  type TiptapDoc,
} from "@/components/shared/tiptap";
```

### Editor Props

```tsx
interface TiptapEditorProps {
  content?: TiptapDoc | null;     // Initial Tiptap JSON
  onChange?: (json: TiptapDoc) => void;  // Called on every change
  placeholder?: string;           // Placeholder text
  editable?: boolean;             // Read-only mode (default: true)
  className?: string;             // Container class
  toolbarClassName?: string;      // Toolbar class
}
```

### TiptapDoc Type

```tsx
type TiptapDoc = JSONContent & { type: "doc" };
```

Always a valid Tiptap document. Use this type for form state, props, and API responses.

---

## Zod Validation (Frontend)

Add a Tiptap document validator to your Zod schema:

```ts
import { z } from "zod";

const tiptapDocSchema = z.object({
  type: z.literal("doc"),
  content: z.array(z.any()).min(1),
}).nullable().optional();

const productSchema = z.object({
  title: z.string().min(1),
  description: tiptapDocSchema,
});
```

### React Hook Form Integration

```tsx
"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { TiptapEditor, emptyDoc, type TiptapDoc } from "@/components/shared/tiptap";

type FormValues = {
  title: string;
  description: TiptapDoc | null;
};

function ProductForm() {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      title: "",
      description: emptyDoc,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TiptapEditor
            content={field.value}
            onChange={field.onChange}
            placeholder="Write product description..."
          />
        )}
      />
    </form>
  );
}
```

---

## Backend (Laravel)

### Migration

Add a `json` column to store Tiptap content:

```php
Schema::table('products', function (Blueprint $table) {
    $table->json('description')->nullable()->change();
});
```

For new tables, use `json` directly:

```php
$table->json('description')->nullable();
```

### Model Casting

Cast the column to an array so Eloquent handles JSON serialization:

```php
use App\Models\Product;

protected function casts(): array
{
    return [
        'description' => 'array',
    ];
}
```

### Form Request Validation

Validate that the incoming value is a valid Tiptap document:

```php
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'description' => ['nullable', 'array'],
            'description.type' => ['required_with:description', 'string', 'in:doc'],
            'description.content' => ['required_with:description', 'array'],
        ];
    }
}
```

### Reusable Validation Rule

Create `app/Rules/ValidTiptapDocument.php`:

```php
<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidTiptapDocument implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_array($value)) {
            $fail("The {$attribute} must be a valid document.");
            return;
        }

        if (($value['type'] ?? null) !== 'doc') {
            $fail("The {$attribute} must be a valid document.");
            return;
        }

        if (empty($value['content']) || !is_array($value['content'])) {
            $fail("The {$attribute} must contain content.");
            return;
        }
    }
}
```

Use it in Form Requests:

```php
use App\Rules\ValidTiptapDocument;

public function rules(): array
{
    return [
        'description' => ['nullable', new ValidTiptapDocument],
    ];
}
```

### API Resource

Return the JSON directly — no transformation needed:

```php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'title' => $this->title,
        'description' => $this->description,  // Already an array from cast
    ];
}
```

### Controller

No special handling needed. The validated data passes through:

```php
public function store(StoreProductRequest $request): JsonResponse
{
    $product = Product::create($request->validated());
    // description is already a PHP array from the request
    // Eloquent casts it to JSON when saving
}
```

---

## Tiptap JSON Format

### Empty Document

```json
{
  "type": "doc",
  "content": [
    { "type": "paragraph" }
  ]
}
```

### Document with Content

```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Product Details" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "This is a " },
        { "type": "text", "marks": [{ "type": "bold" }], "text": "bold" },
        { "type": "text", "text": " word." }
      ]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [
            { "type": "paragraph", "content": [{ "type": "text", "text": "Item one" }] }
          ]
        },
        {
          "type": "listItem",
          "content": [
            { "type": "paragraph", "content": [{ "type": "text", "text": "Item two" }] }
          ]
        }
      ]
    }
  ]
}
```

---

## Editor Extensions

Default extensions (configured in `tiptap-extensions.ts`):

| Extension | Features |
|-----------|----------|
| **StarterKit** | Paragraphs, headings (h1-h3), bold, italic, strike, code, lists, blockquote, hard break, history |
| **Link** | Clickable links (opens in same tab, configurable) |
| **TextAlign** | Left, center, right alignment for headings and paragraphs |
| **Placeholder** | Configurable placeholder text |

### Customizing Extensions

Edit `components/shared/tiptap/tiptap-extensions.ts`:

```tsx
import { getDefaultExtensions } from "@/components/shared/tiptap";

// Add custom extensions
export function getDefaultExtensions(opts?: { placeholder?: string }): Extensions {
  return [
    StarterKit,
    // Add more extensions here
    Placeholder.configure({
      placeholder: opts?.placeholder ?? "Start writing...",
    }),
  ];
}
```

---

## Styling

### Editor

Editor styles are applied via Tailwind classes in `tiptap-editor.tsx` using ProseMirror selectors:

```tsx
[&_.ProseMirror_p]:mb-2
[&_.ProseMirror_h1]:text-2xl
[&_.ProseMirror_strong]:font-bold
// etc.
```

### Content Renderer

`TiptapContent` applies Tailwind classes for rendered output:

```tsx
[&_h1]:text-2xl [&_h1]:font-bold
[&_p]:mb-3 [&_p]:leading-relaxed
[&_a]:text-primary [&_a]:underline
// etc.
```

### Design Tokens Used

| Token | Usage |
|-------|-------|
| `text-primary` | Links, active toolbar buttons |
| `text-muted-foreground` | Placeholder text, blockquotes |
| `border-border` | Editor border, toolbar separator |
| `bg-background` | Editor background |
| `bg-accent` | Active toolbar button background |

All tokens come from the existing design system defined in `globals.css`.

---

## Complete Example: Product Form

### Frontend

```tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { TiptapEditor, emptyDoc, type TiptapDoc } from "@/components/shared/tiptap";
import { useUpdateProductMutation } from "@/features/products/product-api";

type FormValues = {
  title: string;
  description: TiptapDoc | null;
};

export function ProductForm({ product }: { product: Product }) {
  const [updateProduct] = useUpdateProductMutation();

  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      title: product.title,
      description: product.description ?? emptyDoc,
    },
  });

  const onSubmit = async (data: FormValues) => {
    await updateProduct({
      id: product.id,
      ...data,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("title")} />

      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <TiptapEditor
            content={field.value}
            onChange={field.onChange}
            placeholder="Write product description..."
          />
        )}
      />

      <button type="submit">Save</button>
    </form>
  );
}
```

### Backend Migration

```php
$table->json('description')->nullable();
```

### Backend Model

```php
protected function casts(): array
{
    return [
        'description' => 'array',
    ];
}
```

### Backend Request

```php
'description' => ['nullable', 'array'],
'description.type' => ['required_with:description', 'string', 'in:doc'],
'description.content' => ['required_with:description', 'array'],
```

### Backend Resource

```php
'description' => $this->description,
```

---

## Do NOT

- Store HTML in the database
- Use `dangerouslySetInnerHTML` with raw user input
- Convert JSON → HTML → JSON during editing
- Install unnecessary Tiptap extensions
- Create separate API endpoints for Tiptap
- Put business logic in the editor component
- Hard-code colors — use design tokens

---

## File Structure

```
components/shared/tiptap/
├── tiptap-extensions.ts    # Extension config + types + emptyDoc
├── tiptap-editor.tsx       # Interactive editor (client component)
├── tiptap-toolbar.tsx      # Formatting toolbar
├── tiptap-content.tsx      # Read-only renderer
└── index.ts                # Barrel exports
```

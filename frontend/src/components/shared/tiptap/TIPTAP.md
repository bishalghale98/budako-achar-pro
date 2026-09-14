# Tiptap Rich Text Editor

Reusable Tiptap infrastructure for the Laravel + Next.js stack.

**Tiptap JSON is the single source of truth.** Editor outputs JSON, database stores JSON, API returns JSON, server renderer converts to safe HTML.

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

### Server-Side Rendering

```tsx
import { renderTiptapToHtml } from "@/lib/server/tiptap-render";

// In a Server Component or API route
const html = renderTiptapToHtml(page.content);
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
              Zod Schema (frontend)
                      │
                      ▼
                 RTK Query
                      │
              HTTP / JSON Request
                      │
                      ▼
              Laravel API
                      │
              ValidTiptapDocument rule
                      │
                      ▼
                Eloquent Model
                      │
                      ▼
                JSON Column
```

Public side:

```
Laravel Controller
     │
     ▼
renderTiptapToHtml()  ← server-side JSON→HTML walker
     │
     ▼
Safe HTML (escaped, allowlisted)
     │
     ▼
dangerouslySetInnerHTML
```

---

## Components

| Component | Purpose |
|-----------|---------|
| `TiptapEditor` | Interactive rich text editor with fullscreen, focus ring, loading state |
| `TiptapToolbar` | Organized toolbar: heading dropdown, format groups, link popover, image dialog, word count, fullscreen |
| `TiptapContent` | Client-side read-only renderer (uses `generateHTML`) |
| `TiptapLinkPopover` | Popover-based link editor with URL normalization and safety checks |
| `TiptapImageDialog` | Upload-only image dialog with drag-and-drop, validation, preview |
| `emptyDoc` | Empty Tiptap document for form defaults |
| `getDefaultExtensions()` | Returns configured extension array |

### Imports

```tsx
import {
  TiptapEditor,
  TiptapContent,
  TiptapLinkPopover,
  TiptapImageDialog,
  emptyDoc,
  getDefaultExtensions,
  type TiptapDoc,
} from "@/components/shared/tiptap";
```

---

## Editor Props

```tsx
interface TiptapEditorProps {
  content?: TiptapDoc | null;
  onChange?: (json: TiptapDoc) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  toolbarClassName?: string;
}
```

`onImageUpload` is called when the user uploads an image through the toolbar. It should return the public URL. If not provided, a local `blob:` URL is used as fallback.

---

## Extensions

| Extension | Config |
|-----------|--------|
| **StarterKit** | Headings h1-h6, `link: false` (explicit only) |
| **Underline** | underline mark |
| **Link** | `autolink: false`, `openOnClick: false` |
| **TextAlign** | Headings + paragraphs |
| **Placeholder** | Configurable |
| **Image** | `allowBase64: false`, upload-only |
| **CharacterCount** | Word count in toolbar |

---

## Validation (Three Layers)

### 1. Frontend Zod Schema

Explicit recursive validation. Located in `features/pages/page-schema.ts`.

### 2. Laravel Rule

`app/Rules/ValidTiptapDocument.php` — structural, allowlist-based recursive validation.

```php
'description' => ['nullable', new ValidTiptapDocument],
```

Enforces parent→child node structure. Image URLs must start with `/storage/`.

### 3. Server Renderer

`lib/server/tiptap-render.ts` — the final security boundary.

- `escapeHtml()` on all text content
- Only allowlisted nodes rendered
- Unknown nodes skipped safely
- Unsafe links render as text only
- Invalid images not rendered
- Bad heading levels default to `<h2>`

---

## Image System

Upload-only. No remote URLs, no base64 in documents.

```
User clicks Image button
  → TiptapImageDialog opens
  → User drags/selects file (JPEG/PNG/WebP, max 5MB)
  → Alt text required
  → onImageUpload(file) called → returns URL
  → Tiptap node created: { type: "image", attrs: { src, alt } }
```

### Backend Image Storage (Pages)

```
storage/app/public/pages/{pageId}/{timestamp}_{random}.{ext}
```

Images are stored on the `public` disk. Page deletion cleans up all images.

---

## Toolbar Layout

```
[Paragraph/H1-H6▾] | [B I U Sₖ Code] | [Left Center Right] | [• 1. ""] | [🔗 — 🖼] | [↩ ↪] | [Clear]  ···  [3 words] [⛶]
```

- **Block Type**: Heading dropdown (H1-H6) or Paragraph
- **Text Format**: Bold, Italic, Underline, Strikethrough, Inline Code
- **Alignment**: Left, Center, Right
- **Lists**: Bullet, Numbered, Blockquote
- **Insert**: Link (opens popover), Horizontal Rule, Image (opens dialog)
- **History**: Undo, Redo
- **Clear Formatting**: Removes all marks and block types
- **Word Count**: Live character count
- **Fullscreen**: Toggle with ESC to exit

---

## Styling

### Editor

ProseMirror selectors via Tailwind in `tiptap-editor.tsx`:

```tsx
[&_.ProseMirror_h4]:text-base [&_.ProseMirror_h4]:font-bold
[&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto
// etc.
```

### Content Renderer

Tailwind classes in `tiptap-content.tsx`:

```tsx
[&_h4]:text-base [&_h4]:font-bold
[&_img]:max-w-full [&_img]:h-auto
// etc.
```

### Design Tokens

| Token | Usage |
|-------|-------|
| `maroon` / `maroon-hover` | Primary brand color, focus ring |
| `text-primary` | Links, active toolbar buttons |
| `text-muted-foreground` | Placeholder, blockquotes |
| `border-border` | Editor border, separators |
| `bg-accent` | Active toolbar button |

---

## File Structure

```
components/shared/tiptap/
├── tiptap-extensions.ts     # Extension config + types + emptyDoc
├── tiptap-editor.tsx        # Interactive editor (fullscreen, focus ring)
├── tiptap-toolbar.tsx       # Organized toolbar with groups
├── tiptap-content.tsx       # Client-side read-only renderer
├── tiptap-link-popover.tsx  # Link insert/edit popover
├── tiptap-image-dialog.tsx  # Upload-only image dialog
├── index.ts                 # Barrel exports
└── TIPTAP.md                # This file

lib/server/
└── tiptap-render.ts         # Server-side JSON→HTML walker
```

---

## Do NOT

- Store HTML in the database
- Use `generateHTML()` on the server (needs `window.document`)
- Allow base64 images in Tiptap documents
- Allow remote image URLs (upload-only)
- Use `autolink` (users must explicitly insert links)
- Skip the `ValidTiptapDocument` rule on form requests
- Trust the frontend Zod schema alone — the server renderer is the final boundary

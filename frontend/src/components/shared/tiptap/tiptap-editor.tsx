"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { cn } from "cn";
import { getDefaultExtensions, emptyDoc, type TiptapDoc } from "./tiptap-extensions";
import { TiptapToolbar } from "./tiptap-toolbar";
import { Skeleton } from "@/components/ui/skeleton";

interface TiptapEditorProps {
  content?: TiptapDoc | null;
  onChange?: (json: TiptapDoc) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  toolbarClassName?: string;
}

export function TiptapEditor({
  content,
  onChange,
  onImageUpload,
  placeholder,
  editable = true,
  className,
  toolbarClassName,
}: TiptapEditorProps) {
  const extensions = getDefaultExtensions({ placeholder });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: content ?? emptyDoc,
    editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON() as TiptapDoc;
      onChange?.(json);
    },
  });

  useEffect(() => {
    if (editor && !editable) {
      editor.setEditable(false);
    }
  }, [editor, editable]);

  // ESC to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Lock body scroll in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handleImageUpload = useCallback(
    async (file: File): Promise<string> => {
      if (onImageUpload) {
        return onImageUpload(file);
      }
      // Fallback: create local preview URL (for non-page contexts)
      return URL.createObjectURL(file);
    },
    [onImageUpload]
  );

  if (!editor) {
    return (
      <div className={cn("rounded-lg border border-border bg-background", className)}>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full mt-0" />
      </div>
    );
  }

  const wordCount = editor.storage.characterCount?.words() ?? 0;
  const charCount = editor.storage.characterCount?.characters() ?? 0;

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background transition-shadow",
        "focus-within:border-maroon focus-within:ring-1 focus-within:ring-maroon/20",
        isFullscreen &&
          "fixed inset-0 z-50 flex flex-col rounded-none border-0",
        className
      )}
    >
      {editable && (
        <TiptapToolbar
          editor={editor}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onImageUpload={handleImageUpload}
          wordCount={wordCount}
          charCount={charCount}
          className={cn(
            "border-b border-border",
            isFullscreen && "shrink-0",
            toolbarClassName
          )}
        />
      )}
      <EditorContent
        editor={editor}
        className={cn(
          "min-h-[300px] p-3 prose prose-sm max-w-none",
          "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[300px]",
          "[&_.ProseMirror_p]:mb-2",
          "[&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-4 [&_.ProseMirror_h1]:mb-2",
          "[&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:mb-2",
          "[&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:mt-3 [&_.ProseMirror_h3]:mb-1",
          "[&_.ProseMirror_h4]:text-base [&_.ProseMirror_h4]:font-bold [&_.ProseMirror_h4]:mt-2 [&_.ProseMirror_h4]:mb-1",
          "[&_.ProseMirror_h5]:text-sm [&_.ProseMirror_h5]:font-bold [&_.ProseMirror_h5]:mt-2 [&_.ProseMirror_h5]:mb-1",
          "[&_.ProseMirror_h6]:text-sm [&_.ProseMirror_h6]:font-bold [&_.ProseMirror_h6]:mt-2 [&_.ProseMirror_h6]:mb-1",
          "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ul]:mb-2",
          "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_ol]:mb-2",
          "[&_.ProseMirror_li]:mb-1",
          "[&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-muted-foreground [&_.ProseMirror_blockquote]:my-3",
          "[&_.ProseMirror_strong]:font-bold",
          "[&_.ProseMirror_em]:italic",
          "[&_.ProseMirror_u]:underline",
          "[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-2 [&_.ProseMirror_a]:hover:text-primary/80",
          "[&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:rounded [&_.ProseMirror_img]:my-2",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:italic [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
          isFullscreen && "flex-1 overflow-y-auto"
        )}
      />
      {isFullscreen && (
        <div className="shrink-0 flex items-center justify-end gap-3 border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="page-form"
            className="px-4 py-2 text-sm font-medium text-white bg-maroon hover:bg-maroon-hover rounded-md shadow-sm"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

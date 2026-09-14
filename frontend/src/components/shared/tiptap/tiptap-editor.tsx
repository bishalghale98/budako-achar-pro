"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { cn } from "cn";
import { getDefaultExtensions, emptyDoc, type TiptapDoc } from "./tiptap-extensions";
import { TiptapToolbar } from "./tiptap-toolbar";

interface TiptapEditorProps {
  content?: TiptapDoc | null;
  onChange?: (json: TiptapDoc) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  toolbarClassName?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder,
  editable = true,
  className,
  toolbarClassName,
}: TiptapEditorProps) {
  const extensions = getDefaultExtensions({ placeholder });

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

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("rounded-lg border border-border bg-background", className)}>
      {editable && (
        <TiptapToolbar
          editor={editor}
          className={cn("border-b border-border", toolbarClassName)}
        />
      )}
      <EditorContent
        editor={editor}
        className="min-h-[120px] p-3 prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror_p]:mb-2 [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-4 [&_.ProseMirror_h1]:mb-2 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:mt-3 [&_.ProseMirror_h3]:mb-1 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ul]:mb-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_ol]:mb-2 [&_.ProseMirror_li]:mb-1 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-muted-foreground [&_.ProseMirror_blockquote]:my-3 [&_.ProseMirror_strong]:font-bold [&_.ProseMirror_em]:italic [&_.ProseMirror_u]:underline [&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-2 [&_.ProseMirror_a]:hover:text-primary/80 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:italic [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  );
}

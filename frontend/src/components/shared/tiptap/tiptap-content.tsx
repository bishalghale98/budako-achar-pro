"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/core";
import { cn } from "cn";
import { getDefaultExtensions, type TiptapDoc } from "./tiptap-extensions";

interface TiptapContentProps {
  content: TiptapDoc | null;
  className?: string;
}

export function TiptapContent({ content, className }: TiptapContentProps) {
  const html = useMemo(() => {
    if (!content) return "";
    try {
      return generateHTML(content, getDefaultExtensions());
    } catch {
      return "";
    }
  }, [content]);

  if (!html) return null;

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none",
        "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3",
        "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2",
        "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2",
        "[&_h4]:text-base [&_h4]:font-bold [&_h4]:mt-3 [&_h4]:mb-1",
        "[&_h5]:text-sm [&_h5]:font-bold [&_h5]:mt-3 [&_h5]:mb-1",
        "[&_h6]:text-sm [&_h6]:font-bold [&_h6]:mt-3 [&_h6]:mb-1",
        "[&_p]:mb-3 [&_p]:leading-relaxed",
        "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-3",
        "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-3",
        "[&_li]:mb-1",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-4",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary/80",
        "[&_strong]:font-bold",
        "[&_em]:italic",
        "[&_u]:underline",
        "[&_hr]:my-6 [&_hr]:border-border",
        "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded",
        "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4",
        "[&_code]:text-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

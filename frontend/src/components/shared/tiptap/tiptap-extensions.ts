import type { Extensions, JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

export type TiptapDoc = JSONContent & { type: "doc" };

export const emptyDoc: TiptapDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function getDefaultExtensions(opts?: { placeholder?: string }): Extensions {
  return [
    StarterKit,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline underline-offset-2 hover:text-primary/80",
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Placeholder.configure({
      placeholder: opts?.placeholder ?? "Start writing...",
    }),
  ];
}

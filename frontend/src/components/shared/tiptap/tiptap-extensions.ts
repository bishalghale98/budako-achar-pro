import type { Extensions, JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";

export type TiptapDoc = JSONContent & { type: "doc" };

export const emptyDoc: TiptapDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function getDefaultExtensions(opts?: { placeholder?: string }): Extensions {
  return [
    StarterKit.configure({
      link: false,
      heading: { levels: [1, 2, 3, 4, 5, 6] },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: false,
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
    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: "max-w-full h-auto rounded",
      },
    }),
    CharacterCount,
  ];
}

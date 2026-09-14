import type { JSONContent } from "@tiptap/core";

const PAGE_TIPTAP_CLASSES =
  "prose prose-sm max-w-none " +
  "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 " +
  "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 " +
  "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 " +
  "[&_p]:mb-3 [&_p]:leading-relaxed " +
  "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-3 " +
  "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-3 " +
  "[&_li]:mb-1 " +
  "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-4 " +
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary/80 " +
  "[&_strong]:font-bold " +
  "[&_em]:italic " +
  "[&_u]:underline " +
  "[&_hr]:my-6 [&_hr]:border-border";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarks(text: string, marks?: JSONContent["marks"]): string {
  if (!marks) return escapeHtml(text);

  let result = escapeHtml(text);
  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        result = `<strong>${result}</strong>`;
        break;
      case "italic":
        result = `<em>${result}</em>`;
        break;
      case "strike":
        result = `<s>${result}</s>`;
        break;
      case "underline":
        result = `<u>${result}</u>`;
        break;
      case "code":
        result = `<code>${result}</code>`;
        break;
      case "link":
        result = `<a href="${escapeHtml(mark.attrs?.href || "#")}">${result}</a>`;
        break;
    }
  }
  return result;
}

function renderNodes(nodes?: JSONContent[]): string {
  if (!nodes) return "";

  return nodes
    .map((node) => {
      switch (node.type) {
        case "heading": {
          const level = node.attrs?.level || 2;
          return `<h${level}>${renderNodes(node.content)}</h${level}>`;
        }
        case "paragraph":
          return `<p>${renderNodes(node.content)}</p>`;
        case "text":
          return renderMarks(node.text || "", node.marks);
        case "bulletList":
          return `<ul>${renderNodes(node.content)}</ul>`;
        case "orderedList":
          return `<ol>${renderNodes(node.content)}</ol>`;
        case "listItem":
          return `<li>${renderNodes(node.content)}</li>`;
        case "blockquote":
          return `<blockquote>${renderNodes(node.content)}</blockquote>`;
        case "horizontalRule":
          return "<hr />";
        case "hardBreak":
          return "<br />";
        case "codeBlock": {
          const lang = node.attrs?.language || "";
          return `<pre><code class="language-${escapeHtml(lang)}">${renderNodes(node.content)}</code></pre>`;
        }
        default:
          return node.content ? renderNodes(node.content) : "";
      }
    })
    .join("");
}

export function renderTiptapContent(content: JSONContent | null): {
  html: string;
  className: string;
} {
  if (!content) return { html: "", className: PAGE_TIPTAP_CLASSES };

  try {
    const html = renderNodes(content.content);
    return { html, className: PAGE_TIPTAP_CLASSES };
  } catch {
    return { html: "", className: PAGE_TIPTAP_CLASSES };
  }
}

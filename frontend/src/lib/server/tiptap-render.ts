import type { JSONContent } from "@tiptap/core";

const PAGE_TIPTAP_CLASSES =
  "prose prose-sm max-w-none " +
  "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 " +
  "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 " +
  "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 " +
  "[&_h4]:text-base [&_h4]:font-bold [&_h4]:mt-3 [&_h4]:mb-1 " +
  "[&_h5]:text-sm [&_h5]:font-bold [&_h5]:mt-3 [&_h5]:mb-1 " +
  "[&_h6]:text-sm [&_h6]:font-bold [&_h6]:mt-3 [&_h6]:mb-1 " +
  "[&_p]:mb-3 [&_p]:leading-relaxed " +
  "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-3 " +
  "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-3 " +
  "[&_li]:mb-1 " +
  "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-4 " +
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary/80 " +
  "[&_strong]:font-bold " +
  "[&_em]:italic " +
  "[&_u]:underline " +
  "[&_hr]:my-6 [&_hr]:border-border " +
  "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded " +
  "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 " +
  "[&_code]:text-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isSafeUrl(url: string): boolean {
  const lower = url.toLowerCase().trim();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return false;
  }
  return true;
}

function isPageImageUrl(url: string): boolean {
  if (url.startsWith("/storage/pages/")) return true;
  if (/^https?:\/\/[^/]+\/storage\/pages\//.test(url)) return true;
  return false;
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
      case "link": {
        const href = mark.attrs?.href as string | undefined;
        if (href && isSafeUrl(href)) {
          const target =
            mark.attrs?.target === "_blank"
              ? ' target="_blank" rel="noopener noreferrer"'
              : "";
          result = `<a href="${escapeHtml(href)}"${target}>${result}</a>`;
        }
        break;
      }
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
          const safeLevel = Math.min(6, Math.max(1, Number(level) || 2));
          const align = node.attrs?.textAlign as string | undefined;
          const style = align
            ? ` style="text-align:${escapeHtml(String(align))}"`
            : "";
          return `<h${safeLevel}${style}>${renderNodes(node.content)}</h${safeLevel}>`;
        }
        case "paragraph": {
          const align = node.attrs?.textAlign as string | undefined;
          const style = align
            ? ` style="text-align:${escapeHtml(String(align))}"`
            : "";
          return `<p${style}>${renderNodes(node.content)}</p>`;
        }
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
          const lang = (node.attrs?.language as string) || "";
          return `<pre><code class="language-${escapeHtml(lang)}">${renderNodes(node.content)}</code></pre>`;
        }
        case "image": {
          const src = (node.attrs?.src as string) || "";
          if (!src || !isPageImageUrl(src)) return "";
          const alt = escapeHtml((node.attrs?.alt as string) || "");
          const title = node.attrs?.title
            ? ` title="${escapeHtml(String(node.attrs.title))}"`
            : "";
          return `<img src="${escapeHtml(src)}" alt="${alt}"${title} class="max-w-full h-auto rounded" />`;
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

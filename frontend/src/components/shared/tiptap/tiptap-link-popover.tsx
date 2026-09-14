"use client";

import { useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, Unlink } from "lucide-react";

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

function normalizeUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("/") || url.startsWith("#") || url.startsWith("mailto:")) {
    return url;
  }
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url;
  }
  return url;
}

interface TiptapLinkPopoverProps {
  editor: Editor;
}

export function TiptapLinkPopover({ editor }: TiptapLinkPopoverProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [target, setTarget] = useState(false);

  const isActive = editor.isActive("link");

  const handleOpen = useCallback(() => {
    if (isActive) {
      const attrs = editor.getAttributes("link");
      setUrl(attrs.href || "");
      setTarget(attrs.target === "_blank");
    } else {
      setUrl("");
      setTarget(false);
    }
    setOpen(true);
  }, [editor, isActive]);

  const handleSave = useCallback(() => {
    const normalized = normalizeUrl(url.trim());
    if (!normalized) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else if (isSafeUrl(normalized)) {
      const chain = editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: normalized, target: target ? "_blank" : null });
      chain.run();
    }
    setOpen(false);
    setUrl("");
  }, [editor, url, target]);

  const handleRemove = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setOpen(false);
    setUrl("");
  }, [editor]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            onClick={handleOpen}
            className={`inline-flex items-center justify-center h-7 w-7 rounded-sm text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              isActive ? "bg-accent text-accent-foreground" : "text-foreground"
            }`}
          />
        }
      >
        <Link className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start" side="bottom">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Edit Link</span>
            {isActive && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 text-xs text-destructive hover:text-destructive/80"
              >
                <Unlink className="size-3" />
                Remove
              </button>
            )}
          </div>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            className="h-9 text-sm"
            autoFocus
          />
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={target}
              onChange={(e) => setTarget(e.target.checked)}
              className="rounded border-border"
            />
            Open in new tab
          </label>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

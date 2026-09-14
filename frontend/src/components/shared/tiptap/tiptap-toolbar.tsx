"use client";

import { useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Minus,
  ImageIcon,
  RemoveFormatting,
  Maximize2,
  Minimize2,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "cn";
import { TiptapLinkPopover } from "./tiptap-link-popover";
import { TiptapImageDialog } from "./tiptap-image-dialog";

interface TiptapToolbarProps {
  editor: Editor;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onImageUpload?: (file: File) => Promise<string>;
  wordCount?: number;
  charCount?: number;
  className?: string;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  tooltip,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "inline-flex items-center justify-center h-7 w-7 rounded-sm text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
              isActive && "bg-accent text-accent-foreground"
            )}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function TiptapToolbar({
  editor,
  isFullscreen,
  onToggleFullscreen,
  onImageUpload,
  wordCount = 0,
  className,
}: TiptapToolbarProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const handleImageInsert = useCallback(
    (src: string, alt: string) => {
      editor
        .chain()
        .focus()
        .setImage({ src, alt })
        .run();
    },
    [editor]
  );

  const currentHeading = editor.isActive("heading")
    ? String((editor.getAttributes("heading").level as number) || 2)
    : "paragraph";

  const handleHeadingChange = useCallback(
    (value: string | null) => {
      if (!value) return;
      if (value === "paragraph") {
        editor.chain().focus().setParagraph().run();
      } else {
        editor
          .chain()
          .focus()
          .toggleHeading({ level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6 })
          .run();
      }
    },
    [editor]
  );

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-wrap items-center gap-0.5 px-2 py-1.5",
          className
        )}
      >
        {/* Block Type */}
        <Select value={currentHeading} onValueChange={handleHeadingChange}>
          <SelectTrigger className="h-7 w-auto min-w-[100px] text-xs border-0 bg-transparent focus:ring-0">
            <SelectValue>
              {currentHeading === "paragraph"
                ? "Paragraph"
                : `Heading ${currentHeading}`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="1">Heading 1</SelectItem>
            <SelectItem value="2">Heading 2</SelectItem>
            <SelectItem value="3">Heading 3</SelectItem>
            <SelectItem value="4">Heading 4</SelectItem>
            <SelectItem value="5">Heading 5</SelectItem>
            <SelectItem value="6">Heading 6</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Text Format */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="Bold (Ctrl+B)"
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="Italic (Ctrl+I)"
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          tooltip="Underline (Ctrl+U)"
        >
          <Underline className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="Strikethrough"
        >
          <Strikethrough className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          tooltip="Inline Code"
        >
          <Code className="size-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          tooltip="Align Left"
        >
          <AlignLeft className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          tooltip="Align Center"
        >
          <AlignCenter className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          tooltip="Align Right"
        >
          <AlignRight className="size-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="Bullet List"
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="Numbered List"
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          tooltip="Blockquote"
        >
          <Quote className="size-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Insert */}
        <TiptapLinkPopover editor={editor} />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          tooltip="Horizontal Rule"
        >
          <Minus className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setImageDialogOpen(true)}
          disabled={!onImageUpload}
          tooltip={onImageUpload ? "Insert Image" : "Save the page before adding images"}
        >
          <ImageIcon className="size-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* History */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Undo (Ctrl+Z)"
        >
          <Undo className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="size-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Clear Formatting */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          tooltip="Clear Formatting"
        >
          <RemoveFormatting className="size-3.5" />
        </ToolbarButton>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Word Count */}
        <span className="text-xs text-muted-foreground tabular-nums mr-2 select-none">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </span>

        {/* Fullscreen */}
        <ToolbarButton
          onClick={onToggleFullscreen}
          tooltip={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="size-3.5" />
          ) : (
            <Maximize2 className="size-3.5" />
          )}
        </ToolbarButton>
      </div>

      <TiptapImageDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onInsert={handleImageInsert}
        onImageUpload={onImageUpload}
      />
    </TooltipProvider>
  );
}

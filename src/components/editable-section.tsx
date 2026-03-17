"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Pencil, Check, X } from "lucide-react";

interface EditableSectionProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
}

export function EditableSection({ value, onSave, className = "" }: EditableSectionProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit content
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, []);

  useEffect(() => {
    if (editing) {
      resize();
      textareaRef.current?.focus();
    }
  }, [editing, resize]);

  function handleEdit() {
    setDraft(value);
    setEditing(true);
  }

  function handleSave() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    }
    setEditing(false);
  }

  function handleCancel() {
    setDraft(value);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      handleCancel();
    }
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => { setDraft(e.target.value); resize(); }}
          onKeyDown={handleKeyDown}
          className={`w-full bg-background/50 border border-primary/30 rounded-lg p-3 text-sm text-foreground/80 font-body leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-primary/40 ${className}`}
          rows={3}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-body font-medium hover:bg-primary/20 transition-colors"
          >
            <Check className="h-3 w-3" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/60 text-muted-foreground text-xs font-body font-medium hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <p className={`text-sm text-foreground/80 font-body leading-relaxed pr-8 ${className}`}>
        {value}
      </p>
      <button
        onClick={handleEdit}
        className="absolute top-0 right-0 p-1.5 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-card/80 transition-all"
        title="Edit"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

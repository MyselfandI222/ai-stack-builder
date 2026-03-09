"use client";

import { useState } from "react";
import {
  FileText,
  Link as LinkIcon,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  File,
  Table,
  Globe,
} from "lucide-react";

export interface ExtractedDocument {
  url: string;
  title: string;
  type: string;
  text: string;
  extractedAt: string;
}

interface DocumentLinksProps {
  documents: ExtractedDocument[];
  onChange: (documents: ExtractedDocument[]) => void;
  disabled?: boolean;
}

const TYPE_ICONS: Record<string, typeof FileText> = {
  pdf: FileText,
  "google-doc": FileText,
  "google-sheet": Table,
  "google-slides": FileText,
  csv: Table,
  text: File,
  webpage: Globe,
};

const TYPE_LABELS: Record<string, string> = {
  pdf: "PDF",
  "google-doc": "Google Doc",
  "google-sheet": "Google Sheet",
  "google-slides": "Google Slides",
  csv: "CSV",
  text: "Text File",
  webpage: "Web Page",
};

const TYPE_COLORS: Record<string, string> = {
  pdf: "text-red-400 bg-red-500/10",
  "google-doc": "text-blue-400 bg-blue-500/10",
  "google-sheet": "text-emerald-400 bg-emerald-500/10",
  "google-slides": "text-amber-400 bg-amber-500/10",
  csv: "text-emerald-400 bg-emerald-500/10",
  text: "text-zinc-400 bg-zinc-500/10",
  webpage: "text-violet-400 bg-violet-500/10",
};

export function DocumentLinks({ documents, onChange, disabled }: DocumentLinksProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);

  async function handleExtract() {
    const url = inputUrl.trim();
    if (!url) return;

    // Don't add duplicates
    if (documents.some((d) => d.url === url)) {
      setError("This document has already been added.");
      return;
    }

    setIsExtracting(true);
    setError(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Could not extract content from this link.");
        return;
      }

      const doc: ExtractedDocument = {
        url,
        title: data.title || "Document",
        type: data.type || "unknown",
        text: data.text || "",
        extractedAt: new Date().toISOString(),
      };

      onChange([...documents, doc]);
      setInputUrl("");
      setShowInput(false);
    } catch {
      setError("Failed to connect. Please check the URL and try again.");
    } finally {
      setIsExtracting(false);
    }
  }

  function handleRemove(url: string) {
    onChange(documents.filter((d) => d.url !== url));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleExtract();
    }
  }

  return (
    <div className="space-y-3">
      {/* Added Documents */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => {
            const Icon = TYPE_ICONS[doc.type] || FileText;
            const colorClass = TYPE_COLORS[doc.type] || "text-zinc-400 bg-zinc-500/10";
            const label = TYPE_LABELS[doc.type] || "Document";

            return (
              <div
                key={doc.url}
                className="flex items-center gap-3 p-3 rounded-xl bg-background/30 border border-border/20"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-body font-medium text-foreground truncate">
                      {doc.title}
                    </span>
                    <span className="text-[10px] font-body text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-full shrink-0">
                      {label}
                    </span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground font-body truncate mt-0.5">
                    {doc.text.length.toLocaleString()} characters extracted
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => handleRemove(doc.url)}
                    disabled={disabled}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Link Input */}
      {showInput ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Paste a link — Google Doc, PDF, website, spreadsheet..."
                disabled={disabled || isExtracting}
                autoFocus
                className="w-full bg-background/50 border border-border/30 rounded-xl pl-10 pr-4 py-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleExtract}
              disabled={!inputUrl.trim() || isExtracting || disabled}
              className="h-[46px] px-5 rounded-xl bg-foreground text-background font-body font-semibold text-sm disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reading...
                </>
              ) : (
                "Extract"
              )}
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setInputUrl("");
                setError(null);
              }}
              disabled={isExtracting}
              className="h-[46px] px-3 rounded-xl border border-border/30 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400 font-body">{error}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {["Google Docs", "PDFs", "Websites", "Spreadsheets", "Text files"].map((type) => (
              <span key={type} className="text-[10px] font-body text-muted-foreground/60 bg-secondary/30 px-2 py-0.5 rounded-full">
                {type}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border/40 text-sm font-body text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all w-full justify-center disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add a document link
          <span className="text-[10px] bg-secondary/50 px-1.5 py-0.5 rounded-full">
            optional
          </span>
        </button>
      )}
    </div>
  );
}

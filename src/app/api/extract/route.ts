import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

interface ExtractResponse {
  success: boolean;
  text?: string;
  title?: string;
  type?: string;
  error?: string;
}

// Max text length we'll return (to avoid sending massive docs to the AI)
const MAX_TEXT_LENGTH = 15000;

/**
 * Strip HTML tags and decode entities, returning clean text.
 */
function htmlToText(html: string): string {
  // Remove script and style blocks entirely
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  // Remove all HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, "");
  // Replace block-level tags with newlines
  text = text.replace(/<\/(p|div|h[1-6]|li|tr|br|hr)[^>]*>/gi, "\n");
  text = text.replace(/<br[^>]*\/?>/gi, "\n");
  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, " ");
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
  // Collapse whitespace
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n\s*\n/g, "\n\n");
  return text.trim();
}

/**
 * Extract <title> from HTML.
 */
function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? htmlToText(match[1]).trim() : "";
}

/**
 * Convert a Google Docs/Sheets sharing URL to an export URL.
 */
function convertGoogleUrl(url: string): { exportUrl: string; type: string } | null {
  // Google Docs: https://docs.google.com/document/d/DOCID/edit...
  const docsMatch = url.match(
    /docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/
  );
  if (docsMatch) {
    return {
      exportUrl: `https://docs.google.com/document/d/${docsMatch[1]}/export?format=txt`,
      type: "google-doc",
    };
  }

  // Google Sheets: https://docs.google.com/spreadsheets/d/SHEETID/edit...
  const sheetsMatch = url.match(
    /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/
  );
  if (sheetsMatch) {
    return {
      exportUrl: `https://docs.google.com/spreadsheets/d/${sheetsMatch[1]}/export?format=csv`,
      type: "google-sheet",
    };
  }

  // Google Slides: https://docs.google.com/presentation/d/SLIDEID/edit...
  const slidesMatch = url.match(
    /docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/
  );
  if (slidesMatch) {
    return {
      exportUrl: `https://docs.google.com/presentation/d/${slidesMatch[1]}/export?format=txt`,
      type: "google-slides",
    };
  }

  return null;
}

/**
 * Detect the document type from the URL and content-type header.
 */
function detectType(
  url: string,
  contentType: string
): "pdf" | "html" | "text" | "csv" | "unknown" {
  const urlLower = url.toLowerCase();

  if (urlLower.endsWith(".pdf") || contentType.includes("application/pdf")) {
    return "pdf";
  }
  if (
    urlLower.endsWith(".csv") ||
    contentType.includes("text/csv") ||
    contentType.includes("comma-separated")
  ) {
    return "csv";
  }
  if (
    urlLower.endsWith(".txt") ||
    urlLower.endsWith(".md") ||
    urlLower.endsWith(".markdown") ||
    contentType.includes("text/plain") ||
    contentType.includes("text/markdown")
  ) {
    return "text";
  }
  if (contentType.includes("text/html") || contentType.includes("application/xhtml")) {
    return "html";
  }
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url: string };

    if (!url || typeof url !== "string") {
      return NextResponse.json<ExtractResponse>(
        { success: false, error: "Please provide a valid URL." },
        { status: 400 }
      );
    }

    // Basic URL validation
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json<ExtractResponse>(
        { success: false, error: "Invalid URL format." },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json<ExtractResponse>(
        { success: false, error: "Only HTTP and HTTPS URLs are supported." },
        { status: 400 }
      );
    }

    // Check for Google Docs/Sheets/Slides and convert to export URLs
    const googleExport = convertGoogleUrl(url);
    const fetchUrl = googleExport ? googleExport.exportUrl : url;

    // Fetch the document
    const response = await fetch(fetchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AIToolPlanner/1.0; Document Extractor)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json<ExtractResponse>(
        {
          success: false,
          error: `Could not access the document (HTTP ${response.status}). Make sure the link is publicly accessible or sharing is enabled.`,
        },
        { status: 422 }
      );
    }

    const contentType = response.headers.get("content-type") || "";

    // Google exports return plain text / CSV directly
    if (googleExport) {
      const text = await response.text();
      const trimmed =
        text.length > MAX_TEXT_LENGTH
          ? text.slice(0, MAX_TEXT_LENGTH) + "\n\n[Document truncated — showing first 15,000 characters]"
          : text;

      return NextResponse.json<ExtractResponse>({
        success: true,
        text: trimmed,
        title: googleExport.type === "google-sheet" ? "Google Sheet" : "Google Document",
        type: googleExport.type,
      });
    }

    // Detect type and extract accordingly
    const type = detectType(url, contentType);

    switch (type) {
      case "pdf": {
        const buffer = await response.arrayBuffer();
        const parser = new PDFParse({ data: new Uint8Array(buffer) });
        const textResult = await parser.getText();
        const text = textResult.text.trim();

        if (!text) {
          await parser.destroy();
          return NextResponse.json<ExtractResponse>(
            { success: false, error: "Could not extract text from this PDF. It may be image-based or encrypted." },
            { status: 422 }
          );
        }

        let title = "PDF Document";
        try {
          const info = await parser.getInfo();
          if (info.info?.Title) title = info.info.Title as string;
        } catch {
          // Info extraction is optional
        }
        await parser.destroy();

        const trimmed =
          text.length > MAX_TEXT_LENGTH
            ? text.slice(0, MAX_TEXT_LENGTH) + "\n\n[PDF truncated — showing first 15,000 characters]"
            : text;

        return NextResponse.json<ExtractResponse>({
          success: true,
          text: trimmed,
          title,
          type: "pdf",
        });
      }

      case "csv":
      case "text": {
        const text = await response.text();
        const trimmed =
          text.length > MAX_TEXT_LENGTH
            ? text.slice(0, MAX_TEXT_LENGTH) + "\n\n[Document truncated — showing first 15,000 characters]"
            : text;

        return NextResponse.json<ExtractResponse>({
          success: true,
          text: trimmed,
          title: type === "csv" ? "CSV Spreadsheet" : "Text Document",
          type,
        });
      }

      case "html":
      default: {
        const html = await response.text();
        const title = extractTitle(html);
        const text = htmlToText(html);

        if (!text || text.length < 20) {
          return NextResponse.json<ExtractResponse>(
            { success: false, error: "Could not extract meaningful text from this page." },
            { status: 422 }
          );
        }

        const trimmed =
          text.length > MAX_TEXT_LENGTH
            ? text.slice(0, MAX_TEXT_LENGTH) + "\n\n[Page truncated — showing first 15,000 characters]"
            : text;

        return NextResponse.json<ExtractResponse>({
          success: true,
          text: trimmed,
          title: title || "Web Page",
          type: "webpage",
        });
      }
    }
  } catch (error) {
    console.error("Document extraction error:", error);

    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json<ExtractResponse>(
        { success: false, error: "The document took too long to load. Please try a different link." },
        { status: 408 }
      );
    }

    return NextResponse.json<ExtractResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to extract document content.",
      },
      { status: 500 }
    );
  }
}

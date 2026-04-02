// ContentRenderer: renderiza RichText manteniendo negritas del documento original
import type { RichText } from "@/features/cartilla/types";

interface Props {
  segments: RichText;
  className?: string;
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "li";
}

export function RichTextSpan({ segments, className }: { segments: RichText; className?: string }) {
  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.bold
          ? <strong key={i} className="font-semibold text-foreground">{seg.text}</strong>
          : <span key={i}>{seg.text}</span>
      )}
    </span>
  );
}

export function ContentRenderer({ segments, as: Tag = "p", className }: Props) {
  const baseClass = "leading-relaxed text-foreground/90";
  return (
    <Tag className={`${baseClass} ${className || ""}`}>
      {segments.map((seg, i) =>
        seg.bold
          ? <strong key={i} className="font-semibold text-foreground">{seg.text}</strong>
          : <span key={i}>{seg.text}</span>
      )}
    </Tag>
  );
}

interface BulkProps {
  paragraphs: RichText[];
  className?: string;
}

export function ParagraphList({ paragraphs, className }: BulkProps) {
  return (
    <div className={`space-y-3 ${className || ""}`}>
      {paragraphs.map((para, i) => {
        const text = para.map(s => s.text).join("").trim();
        if (!text) return null;
        return <ContentRenderer key={i} segments={para} as="p" />;
      })}
    </div>
  );
}

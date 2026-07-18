"use client";

import { FileText, Info, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LegalTimelineChip } from "@/features/workspace/legal-timeline-chip";
import type { Citation } from "@/types/legal";
import { cn } from "@/lib/utils";

interface CitationCardProps {
  citation: Citation;
  onOpenDetail?: (citation: Citation) => void;
  compact?: boolean;
}

/**
 * Citation Card — tái sử dụng ở mọi nơi có kết luận (Result Card, Evidence Panel).
 * Confidence Badge KHÔNG BAO GIỜ được ẩn khi confidence = "pending" — quy tắc bắt buộc,
 * xem docs/UI/08_COMPONENT_SPEC.md #5.
 */
export function CitationCard({ citation, onOpenDetail, compact }: CitationCardProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/60 p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="text-sm font-medium leading-snug">{citation.articleLabel}</p>
            <p className="text-xs text-muted-foreground">
              {citation.documentCode} · hiệu lực từ{" "}
              {new Date(citation.effectiveDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <ConfidenceBadge confidence={citation.confidence} />
      </div>

      {!compact && (
        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
          <LegalTimelineChip
            events={[{ date: citation.effectiveDate, label: citation.documentCode }]}
          />
        </div>
      )}

      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
        {onOpenDetail && (
          <button
            type="button"
            onClick={() => onOpenDetail(citation)}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Xem chi tiết
          </button>
        )}

        {/* docs/14_BACKLOG.md P1: dẫn thẳng tới văn bản gốc, không chỉ nêu tên điều/khoản —
            người dùng phải tự kiểm chứng được kết luận, đúng nguyên tắc "Citation First". */}
        {citation.sourceUrl && (
          <a
            href={citation.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Văn bản gốc <ExternalLink className="h-3 w-3" aria-hidden />
            <span className="sr-only">(mở tab mới)</span>
          </a>
        )}
      </div>
    </div>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: Citation["confidence"] }) {
  const isVerified = confidence === "verified";
  return (
    <div className="group relative shrink-0">
      <Badge variant={isVerified ? "success" : "warning"} className={cn(!isVerified && "cursor-help")}>
        {!isVerified && <Info className="h-3 w-3" />}
        {isVerified ? "Đã xác minh" : "Đang xác minh"}
      </Badge>
      {!isVerified && (
        <div className="pointer-events-none absolute right-0 top-full z-10 mt-1.5 hidden w-56 rounded-md border border-border bg-popover p-2 text-[11px] leading-relaxed text-muted-foreground shadow-lg group-hover:block">
          Số liệu này đang được đối chiếu với văn bản gốc, có thể thay đổi khi có bản hợp nhất
          chính thức.
        </div>
      )}
    </div>
  );
}

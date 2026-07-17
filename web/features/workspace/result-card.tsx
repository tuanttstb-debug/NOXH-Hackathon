"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, Lightbulb, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CitationCard } from "@/features/workspace/citation-card";
import { ThresholdBar } from "@/features/workspace/threshold-bar";
import { LegalTimelineChip } from "@/features/workspace/legal-timeline-chip";
import type { ResultBlock } from "@/types/chat";
import type { Citation } from "@/types/legal";

const VERDICT_CONFIG = {
  eligible: { icon: CheckCircle2, colorClass: "text-success", bgClass: "bg-success/10 border-success/30" },
  not_eligible: { icon: XCircle, colorClass: "text-danger", bgClass: "bg-danger/10 border-danger/30" },
  insufficient_data: { icon: HelpCircle, colorClass: "text-warning", bgClass: "bg-warning/10 border-warning/30" },
} as const;

/**
 * Result Card — hợp nhất Result Status Header + Threshold Bar + Citation + Uncertainty Callout
 * + AI Suggestion. QUY TẮC BẮT BUỘC: cả 3 trạng thái dùng chung layout/kích thước header,
 * không trạng thái nào được nhỏ/mờ hơn — xem docs/UI/08_COMPONENT_SPEC.md #3.
 */
export function ResultCard({
  result,
  onOpenCitation,
}: {
  result: ResultBlock;
  onOpenCitation?: (c: Citation) => void;
}) {
  const [showAllCitations, setShowAllCitations] = useState(false);
  const config = VERDICT_CONFIG[result.verdict];
  const Icon = config.icon;
  const isUncertain = result.verdict === "insufficient_data";

  const visibleCitations = showAllCitations ? result.citations : result.citations.slice(0, 1);

  return (
    <div className="surface-floating overflow-hidden rounded-xl">
      {/* Result Status Header — cùng cấp bậc thị giác cho cả 3 trạng thái */}
      <div className={cn("flex items-center gap-2.5 border-b px-5 py-4", config.bgClass)}>
        <Icon className={cn("h-5 w-5 shrink-0", config.colorClass)} aria-hidden />
        <h3 className={cn("text-base font-semibold", config.colorClass)}>{result.headline}</h3>
      </div>

      <div className="space-y-4 px-5 py-4">
        {isUncertain ? (
          <div className="border-l-[3px] border-warning bg-warning/5 py-2 pl-4 pr-2">
            <p className="text-sm leading-relaxed text-foreground/90">{result.reason}</p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-foreground/90">{result.reason}</p>
        )}

        {result.threshold && (
          <ThresholdBar
            label={result.threshold.label}
            userValue={result.threshold.userValue}
            limitValue={result.threshold.limitValue}
            unit={result.threshold.unit}
          />
        )}

        {result.conflictingCitations && (
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              2 văn bản quy định khác thời điểm:
            </p>
            <LegalTimelineChip
              variant="conflict"
              events={result.conflictingCitations.map((c) => ({
                date: c.effectiveDate,
                label: c.documentCode,
                conflict: true,
              }))}
            />
          </div>
        )}

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {isUncertain ? "Văn bản liên quan:" : "Căn cứ:"}
          </p>
          <div className="space-y-2">
            {visibleCitations.map((c) => (
              <CitationCard key={c.articleId} citation={c} onOpenDetail={onOpenCitation} compact />
            ))}
          </div>
          {result.citations.length > 1 && (
            <button
              type="button"
              onClick={() => setShowAllCitations((v) => !v)}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {showAllCitations ? "Thu gọn" : `Xem thêm ${result.citations.length - 1} căn cứ khác`}
              <ChevronDown className={cn("h-3 w-3 transition-transform", showAllCitations && "rotate-180")} />
            </button>
          )}
        </div>

        {result.suggestion && (
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 px-3.5 py-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <p className="text-xs leading-relaxed text-foreground/90">
              <span className="font-medium text-primary">Gợi ý: </span>
              {result.suggestion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, Lightbulb, ChevronDown, BookOpen } from "lucide-react";
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
  // Tra cứu pháp lý — màu trung tính có chủ đích: đây là câu trả lời tra cứu, KHÔNG phải phán quyết
  // về hồ sơ của người dùng, nên không được dùng màu xanh/đỏ gợi ý "đủ/không đủ điều kiện".
  legal_answer: { icon: BookOpen, colorClass: "text-primary", bgClass: "bg-primary/10 border-primary/30" },
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
    // `data-result-card` là mốc ổn định cho test đếm số khối kết quả đã render.
    // Trước đó test đếm thẻ <h3> — nhưng màn hình rỗng CŨNG có <h3>, mà nó biến mất ngay khi có
    // tin nhắn đầu tiên, nên số h3 không bao giờ vượt mốc ban đầu và test treo tới timeout.
    <div className="surface-floating overflow-hidden rounded-xl" data-result-card={result.verdict}>
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

        {/* Không có trích dẫn thì KHÔNG hiện nhãn rỗng. Trường hợp có thật: câu hỏi tra cứu về văn
            bản ngoài Knowledge Graph — hệ thống trả lời "chưa có dữ liệu" và đúng là không có căn
            cứ nào để dẫn; hiện nhãn "Căn cứ:" trống chỉ làm người đọc tưởng bị mất nội dung. */}
        {result.citations.length > 0 && (
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
        )}

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

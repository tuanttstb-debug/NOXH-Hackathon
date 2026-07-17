"use client";

import { X, ExternalLink, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfidenceBadge } from "@/features/workspace/citation-card";
import { LegalTimelineChip } from "@/features/workspace/legal-timeline-chip";
import { legalArticles } from "@/mock/legal-documents";
import type { Citation } from "@/types/legal";

/**
 * Evidence Panel (Trust & Evidence Layer) — mở khi bấm "Xem chi tiết" trên Citation Card.
 * Đối chiếu docs/UI/09_HIGH_FIDELITY_SCREENS.md Màn hình 7 + docs/UI/11 (mini timeline
 * hiện ngay trong panel, không điều hướng đi đâu khác).
 */
export function EvidencePanel({
  citation,
  onClose,
}: {
  citation: Citation | null;
  onClose: () => void;
}) {
  const article = citation ? legalArticles.find((a) => a.id === citation.articleId) : null;

  return (
    <AnimatePresence>
      {citation && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            role="dialog"
            aria-label="Chi tiết căn cứ pháp lý"
            className="surface-floating fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto p-6"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="mt-4 text-lg font-semibold">{citation.articleLabel}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {citation.documentTitle} ({citation.documentCode})
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                Hiệu lực từ {new Date(citation.effectiveDate).toLocaleDateString("vi-VN")}
              </span>
              <ConfidenceBadge confidence={citation.confidence} />
            </div>

            {article && (
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">{article.summary}</p>
            )}

            <div className="mt-6 rounded-lg border border-border/60 p-3.5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <History className="h-3.5 w-3.5" /> Lịch sử hiệu lực
              </p>
              <LegalTimelineChip events={[{ date: citation.effectiveDate, label: citation.documentCode }]} />
            </div>

            <a
              href={citation.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Xem văn bản gốc <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { FocusLayout } from "@/layouts/focus-layout";
import { ChatThread } from "@/features/workspace/chat-thread";
import { Composer } from "@/features/workspace/composer";
import { EvidencePanel } from "@/features/workspace/evidence-panel";
import { EmptyState } from "@/features/eligibility/empty-state";
import { ChecklistCard } from "@/features/eligibility/checklist-card";
import { DownloadSummaryButton } from "@/features/eligibility/download-summary-button";
import { useEligibilityChat } from "@/hooks/use-eligibility-chat";
import { eligibilityExamplePrompts } from "@/mock/chat-thread";
import { eligibilityChecklist } from "@/mock/eligibility-checklist";
import type { Citation } from "@/types/legal";

export default function EligibilityCheckerPage() {
  const { messages, isThinking, send, profile, reset } = useEligibilityChat([]);
  const [evidenceCitation, setEvidenceCitation] = useState<Citation | null>(null);

  const lastResult = [...messages].reverse().find((m) => m.result)?.result;
  const showChecklist = lastResult?.verdict === "eligible" && !isThinking;

  // Hồ sơ tích luỹ qua nhiều lượt — hiển thị công khai để người dùng kiểm chứng được hệ thống
  // đang nhớ đúng những gì mình đã khai, và sửa lại được nếu sai (nói lại là ghi đè).
  const knownChips = profile
    ? [
        profile.maritalGroup ? "✓ Tình trạng hôn nhân" : null,
        profile.monthlyIncomeVnd != null ? "✓ Thu nhập" : null,
        profile.hasOwnHousing != null ? "✓ Tình trạng nhà ở" : null,
        profile.residence ? `✓ ${profile.residence}` : null,
      ].filter((c): c is string => c !== null)
    : [];

  return (
    <FocusLayout>
      {messages.length === 0 ? (
        <EmptyState examplePrompts={eligibilityExamplePrompts} onPickExample={send} />
      ) : (
        <ChatThread
          messages={messages}
          onOpenCitation={setEvidenceCitation}
          footer={
            showChecklist && lastResult ? (
              <div className="flex flex-col gap-3">
                <ChecklistCard items={eligibilityChecklist} />
                <div className="flex justify-end">
                  <DownloadSummaryButton result={lastResult} />
                </div>
              </div>
            ) : undefined
          }
        />
      )}

      {knownChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 px-4 py-2 text-xs">
          <span className="text-muted-foreground">Hồ sơ đã ghi nhận:</span>
          {knownChips.map((chip) => (
            <span key={chip} className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-success">
              {chip}
            </span>
          ))}
          <button
            type="button"
            onClick={reset}
            className="ml-auto text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Bắt đầu hồ sơ mới
          </button>
        </div>
      )}

      <Composer
        onSend={send}
        suggestions={undefined}
        disabled={isThinking}
        placeholder={isThinking ? "AI đang xử lý câu hỏi trước..." : "Mô tả hoàn cảnh của bạn..."}
      />

      <EvidencePanel citation={evidenceCitation} onClose={() => setEvidenceCitation(null)} />
    </FocusLayout>
  );
}

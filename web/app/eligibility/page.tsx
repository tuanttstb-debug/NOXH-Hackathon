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
  const { messages, isThinking, send } = useEligibilityChat([]);
  const [evidenceCitation, setEvidenceCitation] = useState<Citation | null>(null);

  const lastResult = [...messages].reverse().find((m) => m.result)?.result;
  const showChecklist = lastResult?.verdict === "eligible" && !isThinking;

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

"use client";

import { useState } from "react";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { WorkspaceLayout } from "@/layouts/workspace-layout";
import { ChatThread } from "@/features/workspace/chat-thread";
import { Composer } from "@/features/workspace/composer";
import { SidePanel } from "@/features/workspace/side-panel";
import { EvidencePanel } from "@/features/workspace/evidence-panel";
import { useEligibilityChat } from "@/hooks/use-eligibility-chat";
import { initialThread, promptSuggestions } from "@/mock/chat-thread";
import type { Citation } from "@/types/legal";

export default function WorkspacePage() {
  const { messages, isThinking, send } = useEligibilityChat(initialThread);
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"citation" | "reasoning" | "graph">("citation");
  const [evidenceCitation, setEvidenceCitation] = useState<Citation | null>(null);

  const allCitations = messages.flatMap((m) => m.result?.citations ?? []);
  const lastReasoning = [...messages].reverse().find((m) => m.reasoningSteps)?.reasoningSteps;

  return (
    <>
      <WorkspaceLayout
        rightPanel={
          <SidePanel
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            citations={allCitations}
            lastReasoningSteps={lastReasoning}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        }
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 px-4 sm:px-6">
          <div>
            <h1 className="text-sm font-semibold">Điều kiện mua NOXH — độc thân</h1>
            <p className="text-xs text-muted-foreground">AI Workspace · Eligibility skill</p>
          </div>
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            aria-label={panelOpen ? "Đóng bảng phụ" : "Mở bảng phụ"}
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
          >
            {panelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </button>
        </div>

        <ChatThread messages={messages} onOpenCitation={setEvidenceCitation} />

        <Composer
          onSend={send}
          suggestions={messages.length <= 4 ? promptSuggestions : undefined}
          disabled={isThinking}
          placeholder={isThinking ? "AI đang xử lý câu hỏi trước..." : "Hỏi tiếp..."}
        />
      </WorkspaceLayout>

      <EvidencePanel citation={evidenceCitation} onClose={() => setEvidenceCitation(null)} />
    </>
  );
}

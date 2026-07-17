"use client";

import { useState } from "react";
import { X, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { CitationCard } from "@/features/workspace/citation-card";
import { ReasoningTrace } from "@/features/workspace/reasoning-trace";
import type { Citation } from "@/types/legal";
import type { ReasoningStep } from "@/types/chat";

type TabId = "citation" | "reasoning" | "graph";

const TABS: { id: TabId; label: string }[] = [
  { id: "citation", label: "Trích dẫn" },
  { id: "reasoning", label: "Suy luận" },
  { id: "graph", label: "Đồ thị" },
];

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  citations: Citation[];
  lastReasoningSteps?: ReasoningStep[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

/**
 * Side Panel — Citation Panel + Reasoning Panel + Knowledge Graph gộp thành 1 panel có tab,
 * mở theo yêu cầu (progressive disclosure), không chiếm diện tích mặc định.
 * Tab điều khiển thủ công (không dùng Radix Tabs) để tránh thêm dependency không cần thiết.
 */
export function SidePanel({
  open,
  onClose,
  citations,
  lastReasoningSteps,
  activeTab,
  onTabChange,
}: SidePanelProps) {
  if (!open) return null;

  return (
    <aside className="hidden w-[340px] shrink-0 flex-col border-l border-border/60 bg-background/60 lg:flex">
      <div className="flex h-16 items-center justify-between border-b border-border/60 px-4">
        <div role="tablist" aria-label="Bảng phụ" className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Đóng bảng phụ"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "citation" && (
          <div className="space-y-2.5" role="tabpanel">
            {citations.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Chưa có trích dẫn nào trong cuộc trò chuyện này.
              </p>
            ) : (
              citations.map((c) => <CitationCard key={c.articleId} citation={c} />)
            )}
          </div>
        )}

        {activeTab === "reasoning" && (
          <div role="tabpanel">
            {lastReasoningSteps ? (
              <ReasoningTrace steps={lastReasoningSteps} />
            ) : (
              <p className="text-xs text-muted-foreground">Chưa có bước suy luận nào để hiển thị.</p>
            )}
          </div>
        )}

        {activeTab === "graph" && (
          <div role="tabpanel" className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <Network className="h-8 w-8 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Knowledge Graph Explorer đầy đủ thuộc Màn hình 6 (dành cho Admin/Cơ quan quản lý).
              Ở đây chỉ hiển thị sơ đồ suy luận thu nhỏ — xem tab "Suy luận".
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

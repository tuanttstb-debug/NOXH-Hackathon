"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale,
  Plus,
  ShieldCheck,
  FileSearch,
  ScanSearch,
  GitCompareArrows,
  History as HistoryIcon,
  PanelLeftClose,
  PanelLeftOpen,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { quickSkills, historyItems } from "@/mock/chat-thread";

const SKILL_ICON: Record<string, LucideIcon> = {
  eligibility: ShieldCheck,
  search: FileSearch,
  factcheck: ScanSearch,
  diff: GitCompareArrows,
};

/**
 * Chỉ skill nào đã có màn hình thật mới điều hướng được. Skill chưa dựng hiển thị rõ là
 * "chưa có" thay vì trông như bấm được rồi không xảy ra gì — nút giả đúng là dạng
 * "Potemkin" mà docs/16_DESIGN_REVIEW.md cảnh báo.
 */
const SKILL_ROUTE: Record<string, string | undefined> = {
  eligibility: "/eligibility",
  search: "/legal",
};

/**
 * Rail điều hướng cho Workspace Mode (docs/UI/02_INFORMATION_ARCHITECTURE.md) — icon-first,
 * mở rộng khi cần, khác hẳn sidebar liệt kê module của tài liệu tham khảo TPBank
 * (xem docs/UI/01_UI_REVIEW.md phần Navigation).
 */
export function WorkspaceSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-border/60 bg-background/60 transition-all duration-200 sm:flex",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className={cn("flex items-center gap-2 font-semibold", collapsed && "justify-center")}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Scale className="h-4 w-4" />
          </span>
          {!collapsed && <span>NOXH Copilot</span>}
        </Link>
      </div>

      <div className="px-3">
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted",
            collapsed && "justify-center px-0"
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && "Cuộc trò chuyện mới"}
        </button>
      </div>

      <nav className="mt-6 px-3">
        {!collapsed && (
          <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Quick Skill
          </p>
        )}
        <ul className="space-y-1">
          {quickSkills.map((skill) => {
            const Icon = SKILL_ICON[skill.icon];
            const route = SKILL_ROUTE[skill.id];
            const inner = (
              <>
                <Icon
                  className={cn("h-4 w-4 shrink-0", route ? "text-primary" : "text-muted-foreground/60")}
                  aria-hidden
                />
                {!collapsed && (
                  <span className="min-w-0">
                    <span className="block leading-tight">
                      {skill.label}
                      {!route && (
                        <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">
                          · chưa có
                        </span>
                      )}
                    </span>
                    <span className="block text-[11px] leading-tight text-muted-foreground">
                      {skill.description}
                    </span>
                  </span>
                )}
              </>
            );

            const className = cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
              route ? "text-foreground/90 hover:bg-muted" : "cursor-not-allowed text-muted-foreground/70",
              collapsed && "justify-center px-0"
            );

            return (
              <li key={skill.id}>
                {route ? (
                  <Link href={route} title={skill.label} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <span title={`${skill.label} — chưa triển khai`} className={className} aria-disabled>
                    {inner}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="mt-6 flex-1 overflow-y-auto px-3">
          <p className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <HistoryIcon className="h-3 w-3" /> Lịch sử
          </p>
          <ul className="space-y-1">
            {historyItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="w-full rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
                >
                  <p className="truncate text-xs font-medium text-foreground/90">{item.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{item.updatedAt}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {collapsed && <div className="flex-1" />}

      <div className="border-t border-border/60 p-3">
        <div className={cn("flex items-center gap-2.5 rounded-lg px-2 py-2", collapsed && "justify-center px-0")}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <User className="h-3.5 w-3.5" />
          </span>
          {!collapsed && <span className="text-xs text-foreground/90">Khách</span>}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          className={cn(
            "mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!collapsed && "Thu gọn"}
        </button>
      </div>
    </aside>
  );
}

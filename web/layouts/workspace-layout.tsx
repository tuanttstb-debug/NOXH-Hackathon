import type { ReactNode } from "react";
import { WorkspaceSidebar } from "@/features/workspace/workspace-sidebar";

/**
 * Layout cho Workspace Mode (docs/UI/02_INFORMATION_ARCHITECTURE.md) — khác MarketingLayout.
 * Rail sidebar cố định + khu vực chính + slot panel phụ bên phải (tuỳ trang truyền vào).
 */
export function WorkspaceLayout({
  children,
  rightPanel,
}: {
  children: ReactNode;
  rightPanel?: ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <WorkspaceSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      {rightPanel}
    </div>
  );
}

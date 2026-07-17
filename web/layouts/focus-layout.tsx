import type { ReactNode } from "react";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

/**
 * Layout cho Focus Mode (docs/UI/02_INFORMATION_ARCHITECTURE.md) — dành cho người dân, dùng
 * cho một tác vụ duy nhất. Khác WorkspaceLayout: KHÔNG sidebar, KHÔNG side panel, cột đơn,
 * mobile-first, thanh trên cùng tối giản chỉ có logo + lối về Landing Page.
 */
export function FocusLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Scale className="h-3.5 w-3.5" />
            </span>
            <span>
              NOXH <span className="text-primary">Copilot</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Trang chủ
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

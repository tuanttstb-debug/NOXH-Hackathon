import type { ReactNode } from "react";
import { NavBar } from "@/features/landing/nav-bar";
import { Footer } from "@/features/landing/footer";

/**
 * Layout cho các trang công khai (Landing). Khác Workspace Layout (chat/sidebar)
 * sẽ dựng ở màn hình 2 — theo đúng phân biệt Focus Mode/Workspace Mode
 * ở docs/UI/02_INFORMATION_ARCHITECTURE.md.
 */
export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

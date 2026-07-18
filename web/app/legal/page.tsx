"use client";

import { useMemo, useState } from "react";
import { Search, ScrollText } from "lucide-react";
import { WorkspaceLayout } from "@/layouts/workspace-layout";
import { Badge } from "@/components/ui/badge";
import { ArticleResultCard } from "@/features/legal-search/article-result-card";
import { availableAspects, searchArticles } from "@/lib/legal-search";
import { cn } from "@/lib/utils";

/**
 * Màn hình 4 — Legal Search (docs/UI/05_SCREEN_LIST.md).
 * Tra cứu thuần trên Knowledge Graph, không gọi LLM — xem lý do trong lib/legal-search.ts.
 */
export default function LegalSearchPage() {
  const [query, setQuery] = useState("");
  const [aspect, setAspect] = useState<string | null>(null);
  const [activeOnly, setActiveOnly] = useState(false);

  const aspects = useMemo(() => availableAspects(), []);
  const results = useMemo(
    () => searchArticles({ query, aspect, activeOnly }),
    [query, aspect, activeOnly]
  );

  return (
    <WorkspaceLayout>
      <div className="flex h-full flex-col overflow-hidden">
        <header className="border-b border-border/60 px-6 py-5">
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-primary" aria-hidden />
              <h1 className="text-lg font-semibold">Tra cứu văn bản pháp lý</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Tìm trong Knowledge Graph các điều khoản về điều kiện hưởng chính sách Nhà ở xã hội —
              kèm trạng thái hiệu lực và lịch sử sửa đổi.
            </p>

            <div className="relative mt-4">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ví dụ: trần thu nhập độc thân, thẩm quyền xác nhận..."
                aria-label="Từ khoá tra cứu"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <FilterChip active={aspect === null} onClick={() => setAspect(null)}>
                Tất cả
              </FilterChip>
              {aspects.map((a) => (
                <FilterChip key={a.value} active={aspect === a.value} onClick={() => setAspect(a.value)}>
                  {a.label} ({a.count})
                </FilterChip>
              ))}

              <label className="ml-auto flex cursor-pointer select-none items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={activeOnly}
                  onChange={(e) => setActiveOnly(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[hsl(var(--primary))]"
                />
                Chỉ hiện điều khoản đang hiệu lực
              </label>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {results.length} điều khoản
                {query.trim() && ` khớp "${query.trim()}"`}
              </p>
              <Badge variant="secondary">Tra cứu trực tiếp, không qua AI</Badge>
            </div>

            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 px-6 py-12 text-center">
                <p className="text-sm font-medium">Không tìm thấy điều khoản nào</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Knowledge Graph hiện chỉ nạp các điều khoản phục vụ kiểm tra điều kiện thụ hưởng —
                  chưa bao phủ toàn bộ pháp luật nhà ở.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {results.map((item) => (
                  <ArticleResultCard key={item.article.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-border text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

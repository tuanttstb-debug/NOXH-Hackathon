"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/features/workspace/citation-card";
import { amendmentChainFor, aspectLabel, statusLabel, type ArticleWithDocument } from "@/lib/legal-search";
import { cn } from "@/lib/utils";

function statusVariant(status: ArticleWithDocument["article"]["status"]) {
  if (status === "active") return "success" as const;
  if (status === "amended") return "warning" as const;
  return "secondary" as const;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function ArticleResultCard({ item }: { item: ArticleWithDocument }) {
  const [showChain, setShowChain] = useState(false);
  const { article, document } = item;
  const chain = amendmentChainFor(article);
  const hasChain = chain.length > 1;

  return (
    <article className="rounded-xl border border-border/60 bg-card/60 p-4 transition-colors hover:border-border">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0">
            <h3 className="text-sm font-medium leading-snug">{article.label}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {document.code} · {document.title}
            </p>
          </div>
        </div>
        <ConfidenceBadge confidence={article.confidence} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{article.summary}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant={statusVariant(article.status)}>{statusLabel(article.status)}</Badge>
        <Badge variant="outline">{aspectLabel(article.aspect)}</Badge>
        <span className="text-xs text-muted-foreground">
          Hiệu lực từ {formatDate(article.effectiveDate)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/50 pt-2.5">
        <a
          href={document.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Văn bản gốc <ExternalLink className="h-3 w-3" aria-hidden />
          <span className="sr-only">(mở tab mới)</span>
        </a>

        {hasChain && (
          <button
            type="button"
            onClick={() => setShowChain((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            aria-expanded={showChain}
          >
            Lịch sử sửa đổi ({chain.length} mốc)
            <ChevronDown className={cn("h-3 w-3 transition-transform", showChain && "rotate-180")} aria-hidden />
          </button>
        )}
      </div>

      {showChain && hasChain && (
        <ol className="mt-3 space-y-2 border-l border-border/60 pl-4">
          {chain.map(({ article: a, document: d }) => (
            <li key={a.id} className="relative">
              <span
                className={cn(
                  "absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ring-2 ring-background",
                  a.status === "active" ? "bg-success" : "bg-muted-foreground/50"
                )}
                aria-hidden
              />
              <p className="text-xs font-medium">
                {formatDate(a.effectiveDate)} — {d.code}
                {a.id === article.id && <span className="ml-1.5 text-muted-foreground">(đang xem)</span>}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">{a.summary}</p>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

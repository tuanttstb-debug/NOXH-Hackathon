"use client";

import { AlertTriangle, ExternalLink, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CitationCard } from "@/features/workspace/citation-card";
import type { ProjectReport, ReportSection } from "@/lib/project-intelligence/report";
import { SOURCE_TIER_LABEL, type SourceTier } from "@/types/project";

/** Phân tầng nguồn hiển thị khác nhau — PROJECT_INTELLIGENCE.md §11, điểm Safety rẻ nhất. */
const TIER_VARIANT: Record<SourceTier, "success" | "default" | "warning" | "secondary"> = {
  chinh_thong: "success",
  bao_chi: "default",
  cong_dong: "warning",
  ai_suy_luan: "secondary",
};

export function ReportView({ report }: { report: ProjectReport }) {
  const { project } = report;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-xl font-semibold">{project.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {project.address}
          {project.districtName && `, ${project.districtName}`}, {project.provinceName}
        </p>
      </header>

      {report.droppedForMissingSource.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
          <p className="leading-relaxed">
            Đã loại khỏi báo cáo {report.droppedForMissingSource.length} khối vì dữ liệu không kèm
            nguồn tra được: <strong>{report.droppedForMissingSource.join(", ")}</strong>.
          </p>
        </div>
      )}

      {report.sections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}

      <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/40 p-3.5 text-xs">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <p className="leading-relaxed text-muted-foreground">{report.disclaimer}</p>
      </div>
    </div>
  );
}

function SectionBlock({ section }: { section: ReportSection }) {
  return (
    <section className="rounded-xl border border-border/60 bg-card/60 p-4">
      <h3 className="text-sm font-semibold">{section.title}</h3>

      {section.status === "no_data" ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{section.emptyReason}</p>
      ) : (
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {section.fields.map((f, i) => (
            <div key={`${section.id}-${i}`} className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{f.label}</dt>
              <dd className="text-sm leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {section.legalCitations && section.legalCitations.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Căn cứ pháp lý (từ Legal Knowledge Graph)
          </p>
          <div className="flex flex-col gap-2">
            {section.legalCitations.map((c) => (
              <CitationCard key={c.articleId} citation={c} compact />
            ))}
          </div>
        </div>
      )}

      {section.citations.length > 0 && (
        <div className="mt-4 border-t border-border/50 pt-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Nguồn
          </p>
          <ul className="flex flex-col gap-1.5">
            {section.citations.map((c, i) => (
              <li key={`${section.id}-src-${i}`} className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant={TIER_VARIANT[c.sourceTier]}>{SOURCE_TIER_LABEL[c.sourceTier]}</Badge>
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  {c.sourceName} <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
                <span className="text-muted-foreground">
                  · tra ngày {new Date(c.retrievedAt).toLocaleDateString("vi-VN")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Building2, Search } from "lucide-react";
import { WorkspaceLayout } from "@/layouts/workspace-layout";
import { ReportView } from "@/features/project-intelligence/report-view";
import { buildReport } from "@/lib/project-intelligence/report";
import { hasProjectData, projects, resolveProjects } from "@/lib/project-intelligence/project-kg";

/**
 * Project Intelligence (docs/features/PROJECT_INTELLIGENCE.md).
 * Phạm vi theo docs/technical/10_TECHNICAL_DECISION.md kịch bản <24h: Tổng quan + Pháp lý + Citation.
 * KHÔNG có Live Search, Follow-up Question, bộ lọc nâng cao — cắt có chủ đích.
 */
export default function ProjectIntelligencePage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const candidates = useMemo(() => (query.trim() ? resolveProjects(query) : projects), [query]);
  const selected = useMemo(
    () => (selectedId ? projects.find((p) => p.projectId === selectedId) ?? null : null),
    [selectedId]
  );
  const report = useMemo(() => (selected ? buildReport(selected) : null), [selected]);

  return (
    <WorkspaceLayout>
      <div className="flex h-full flex-col overflow-hidden">
        <header className="border-b border-border/60 px-6 py-5">
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" aria-hidden />
              <h1 className="text-lg font-semibold">Tra cứu dự án Nhà ở xã hội</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Tổng hợp thông tin dự án kèm nguồn tra được và văn bản pháp lý áp dụng.
            </p>

            <div className="relative mt-4">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedId(null);
                }}
                disabled={!hasProjectData()}
                placeholder="Nhập tên dự án..."
                aria-label="Tên dự án"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="mx-auto w-full max-w-3xl">
            {!hasProjectData() ? (
              <EmptyDataState />
            ) : report ? (
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="mb-4 text-xs font-medium text-primary hover:underline"
                >
                  ← Chọn dự án khác
                </button>
                <ReportView report={report} />
              </div>
            ) : (
              <CandidateList
                candidates={candidates}
                query={query}
                onSelect={setSelectedId}
              />
            )}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

/**
 * Trạng thái chưa có dữ liệu — hiển thị thẳng lý do thay vì màn hình trống hoặc dữ liệu mẫu.
 * Đây là hành vi đúng theo docs/12_QUAN_LY_RUI_RO.md (không xây suy luận trên dữ liệu chưa kiểm chứng).
 */
function EmptyDataState() {
  return (
    <div className="rounded-xl border border-dashed border-border/60 px-6 py-12 text-center">
      <p className="text-sm font-medium">Chưa nạp dữ liệu dự án</p>
      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
        Toàn bộ pipeline, ràng buộc trích dẫn và liên kết sang Legal Knowledge Graph đã sẵn sàng —
        chỉ còn chờ dữ liệu dự án có nguồn kiểm chứng. Hệ thống cố ý không hiển thị dữ liệu mẫu:
        một báo cáo bịa nguy hiểm hơn một báo cáo trống.
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        Xem <code className="rounded bg-muted px-1.5 py-0.5">web/lib/Projects/DU_LIEU_CAN_CUNG_CAP.md</code>
      </p>
    </div>
  );
}

function CandidateList({
  candidates,
  query,
  onSelect,
}: {
  candidates: ReturnType<typeof resolveProjects>;
  query: string;
  onSelect: (id: string) => void;
}) {
  if (candidates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 px-6 py-12 text-center">
        <p className="text-sm font-medium">Không tìm thấy dự án khớp &ldquo;{query}&rdquo;</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Hệ thống chỉ tra được các dự án đã nạp dữ liệu có nguồn — không suy đoán dự án chưa biết.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* FR-01: nhiều ứng viên thì phải để người dùng xác nhận, hệ thống không tự chọn. */}
      {candidates.length > 1 && (
        <p className="text-xs text-muted-foreground">
          Tìm thấy {candidates.length} dự án gần khớp — chọn đúng dự án bạn cần:
        </p>
      )}
      {candidates.map((p) => (
        <button
          key={p.projectId}
          type="button"
          onClick={() => onSelect(p.projectId)}
          className="rounded-xl border border-border/60 bg-card/60 p-4 text-left transition-colors hover:border-border"
        >
          <p className="text-sm font-medium">{p.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {p.address}, {p.provinceName}
          </p>
        </button>
      ))}
    </div>
  );
}

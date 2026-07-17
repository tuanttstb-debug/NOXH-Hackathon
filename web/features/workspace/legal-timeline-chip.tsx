"use client";

import { cn } from "@/lib/utils";

interface TimelineEvent {
  date: string; // ISO
  label: string;
  conflict?: boolean;
}

interface LegalTimelineChipProps {
  events: TimelineEvent[];
  todayLabel?: string;
  variant?: "default" | "conflict";
}

const TODAY = new Date("2026-07-17");

function toPercent(date: string, min: number, max: number) {
  const t = new Date(date).getTime();
  if (max === min) return 50;
  return ((t - min) / (max - min)) * 100;
}

/**
 * Legal Timeline Chip — dải thời gian thu nhỏ cho mỗi trích dẫn.
 * Ở variant="conflict", 2 mốc mâu thuẫn được tô status-uncertain (warning) và
 * vùng giữa 2 mốc (nơi "Hôm nay" rơi vào) được tô nền mờ — trực quan hoá lý do
 * "Thiếu thông tin" thay vì chỉ mô tả bằng chữ. Đối chiếu
 * docs/UI/11_AI_NATIVE_REDESIGN.md — component B.
 */
export function LegalTimelineChip({
  events,
  todayLabel = "Hôm nay",
  variant = "default",
}: LegalTimelineChipProps) {
  const allDates = [...events.map((e) => new Date(e.date).getTime()), TODAY.getTime()];
  const min = Math.min(...allDates) - 1000 * 60 * 60 * 24 * 60; // đệm 60 ngày mỗi phía
  const max = Math.max(...allDates) + 1000 * 60 * 60 * 24 * 60;
  const todayPct = toPercent(TODAY.toISOString(), min, max);

  const isConflict = variant === "conflict" && events.length >= 2;

  return (
    <div className="w-full py-2">
      <div className="relative h-1.5 w-full rounded-full bg-muted">
        {isConflict && (
          <div
            className="absolute top-0 h-full rounded-full bg-warning/25"
            style={{
              left: `${toPercent(events[0].date, min, max)}%`,
              width: `${toPercent(events[events.length - 1].date, min, max) - toPercent(events[0].date, min, max)}%`,
            }}
            aria-hidden
          />
        )}

        {events.map((ev) => {
          const pct = toPercent(ev.date, min, max);
          return (
            <div
              key={ev.date + ev.label}
              className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pct}%` }}
            >
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full border-2 border-background",
                  ev.conflict || isConflict ? "bg-warning" : "bg-success"
                )}
              />
              <div className="pointer-events-none absolute left-1/2 top-4 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[10px] text-muted-foreground group-hover:block">
                {ev.label} · {new Date(ev.date).toLocaleDateString("vi-VN")}
              </div>
            </div>
          );
        })}

        {/* Mốc Hôm nay */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${todayPct}%` }}
        >
          <div className="h-3 w-3 rotate-45 border border-primary bg-primary" />
        </div>
      </div>

      <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
        <span>{events[0] && new Date(events[0].date).toLocaleDateString("vi-VN")}</span>
        <span className="font-medium text-primary">{todayLabel}</span>
        <span>{events[events.length - 1] && new Date(events[events.length - 1].date).toLocaleDateString("vi-VN")}</span>
      </div>
    </div>
  );
}

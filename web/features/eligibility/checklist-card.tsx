"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Square, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChecklistItem } from "@/types/chat";

/**
 * Checklist chuẩn bị hồ sơ — chỉ xuất hiện sau kết quả "Đủ điều kiện". Tự quản lý trạng thái
 * tick cục bộ (không lưu lại giữa các phiên — đúng tinh thần "không backend thật" của prototype).
 */
export function ChecklistCard({ items }: { items: ChecklistItem[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const doneCount = Object.values(checked).filter(Boolean).length;

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="surface-floating rounded-2xl p-4 sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Chuẩn bị hồ sơ</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {doneCount}/{items.length} đã chuẩn bị
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {items.map((item) => {
          const isChecked = !!checked[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3 text-left transition-colors hover:border-primary/40",
                  isChecked && "border-success/40 bg-success/5"
                )}
                aria-pressed={isChecked}
              >
                {isChecked ? (
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                ) : (
                  <Square className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isChecked && "text-muted-foreground line-through"
                    )}
                  >
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

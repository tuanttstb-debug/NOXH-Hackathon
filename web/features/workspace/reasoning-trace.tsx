"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReasoningStep } from "@/types/chat";

/**
 * Mini Knowledge Graph Trace — thay "AI Reasoning Trace" dạng chữ thuần bằng một chuỗi
 * nút-liên-kết nhỏ, animate dần theo trạng thái từng bước. Đối chiếu
 * docs/UI/11_AI_NATIVE_REDESIGN.md mục A + docs/UI/10 (Màn hình 3).
 * Đây KHÔNG phải Knowledge Graph Explorer đầy đủ (P2/Admin, dùng react-force-graph sau) —
 * chỉ là sơ đồ minh hoạ 4 nút cố định ánh xạ đúng pipeline Parse→Retrieve→Reasoning→Fact-Check.
 */
export function ReasoningTrace({ steps }: { steps: ReasoningStep[] }) {
  const activeIndex = steps.findIndex((s) => s.status === "active");
  const currentLabel = steps[activeIndex]?.label ?? steps[steps.length - 1]?.label;

  return (
    <div className="surface-floating rounded-xl p-4">
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium",
                  step.status === "done" &&
                    "border-success/50 bg-success/15 text-success",
                  step.status === "active" &&
                    "border-primary bg-primary/20 text-primary animate-pulse-soft",
                  step.status === "pending" &&
                    "border-border bg-muted/40 text-muted-foreground"
                )}
              >
                {step.status === "done" ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </motion.div>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-1.5 h-px flex-1 bg-border">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: step.status === "done" ? 1 : 0 }}
                  style={{ transformOrigin: "left" }}
                  className="h-px bg-success/60"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        <span className="text-foreground">{currentLabel}</span>
        {activeIndex !== -1 && <span className="animate-pulse-soft">…</span>}
      </p>
    </div>
  );
}

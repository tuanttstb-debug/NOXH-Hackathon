"use client";

import { motion } from "framer-motion";

interface ThresholdBarProps {
  label: string;
  userValue: number;
  limitValue: number;
  unit: string;
}

/**
 * Threshold Comparison Bar — thay một phần lời giải thích bằng hình so sánh trực tiếp.
 * Đối chiếu docs/UI/11_AI_NATIVE_REDESIGN.md — component C.
 */
export function ThresholdBar({ label, userValue, limitValue, unit }: ThresholdBarProps) {
  const max = Math.max(userValue, limitValue) * 1.15;
  const userPct = (userValue / max) * 100;
  const limitPct = (limitValue / max) * 100;
  const overLimit = userValue > limitValue;

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-medium text-foreground">
          {userValue} / {limitValue} {unit}
        </span>
      </div>

      <div className="relative mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-border/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(userPct, 100)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={overLimit ? "h-full rounded-full bg-danger" : "h-full rounded-full bg-success"}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground/70"
          style={{ left: `${Math.min(limitPct, 100)}%` }}
          title={`Ngưỡng: ${limitValue} ${unit}`}
        />
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>0</span>
        <span>Ngưỡng cho phép: {limitValue} {unit}</span>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

/**
 * Màn hình chào khi chưa có câu hỏi nào (Focus Mode bắt đầu trống, khác AI Workspace được
 * seed sẵn kịch bản). Tối giản, một tác vụ duy nhất: kiểm tra điều kiện mua/thuê NOXH.
 */
export function EmptyState({
  examplePrompts,
  onPickExample,
}: {
  examplePrompts: string[];
  onPickExample: (text: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 py-12 text-center sm:px-6"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <ShieldCheck className="h-6 w-6" />
      </span>

      <div className="space-y-2">
        <h1 className="text-xl font-semibold sm:text-2xl">Kiểm tra điều kiện mua/thuê NOXH</h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Mô tả hoàn cảnh của bạn (thu nhập, tình trạng hôn nhân, nhà ở, nơi cư trú) — AI sẽ đối
          chiếu với văn bản pháp luật đang hiệu lực và trả lời kèm căn cứ rõ ràng.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Thử với ví dụ
        </p>
        {examplePrompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPickExample(p)}
            className="surface-floating rounded-xl px-4 py-3 text-left text-sm text-foreground/90 transition-colors hover:border-primary/40"
          >
            {p}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

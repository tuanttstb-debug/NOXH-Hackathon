"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTypingEffect } from "@/hooks/use-typing-effect";
import { cn } from "@/lib/utils";

const EXAMPLE_PROMPTS = [
  "Tôi độc thân, lương 18 triệu, chưa có nhà — có đủ điều kiện mua NOXH không?",
  "Mức trần thu nhập cho người đã kết hôn là bao nhiêu?",
  "Nghị định 100/2024 vừa bị sửa đổi ở điều nào?",
];

const SUGGESTION_CHIPS = [
  "Tôi mới cưới, lương 2 vợ chồng 35 triệu, có đủ điều kiện không?",
  "So sánh Nghị định 261/2025 và 136/2026",
  "Thủ tục xác nhận thu nhập hiện nay do ai cấp?",
];

/**
 * Ô tìm kiếm AI trung tâm — KHÔNG phải search box tra cứu từ khoá truyền thống.
 * Đây là điểm vào hội thoại (đúng mô hình Thread-based, docs/UI/11_AI_NATIVE_REDESIGN.md).
 * Gõ chữ đầu tiên = bắt đầu, không có bước "xác nhận" trung gian.
 */
export function AiSearchBar() {
  const [value, setValue] = useState("");
  const placeholder = useTypingEffect(EXAMPLE_PROMPTS);
  const router = useRouter();

  function handleSubmit() {
    if (!value.trim()) return;
    router.push("/workspace");
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        className={cn(
          "surface-floating flex items-center gap-3 rounded-2xl px-5 py-4 transition-shadow",
          "focus-within:ring-2 focus-within:ring-ring/60"
        )}
      >
        <Sparkles className="h-5 w-5 shrink-0 text-primary" aria-hidden />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder || "Hỏi bất kỳ điều gì về Nhà ở xã hội..."}
          aria-label="Hỏi AI về Nhà ở xã hội"
          className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSubmit}
          aria-label="Gửi câu hỏi"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          disabled={value.trim().length === 0}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {SUGGESTION_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setValue(chip)}
            className="rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComposerProps {
  onSend: (text: string) => void;
  suggestions?: string[];
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Composer — neo dưới cùng, không bao giờ "kết thúc hội thoại". Đối chiếu
 * docs/UI/11_AI_NATIVE_REDESIGN.md: đây là ô hỏi tiếp, không phải nút "Hỏi câu khác" reset.
 */
export function Composer({ onSend, suggestions, disabled, placeholder }: ComposerProps) {
  const [value, setValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedName, setAttachedName] = useState<string | null>(null);

  function handleSend() {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    setAttachedName(null);
  }

  return (
    <div className="border-t border-border/60 bg-background/80 p-4 backdrop-blur-md sm:p-6">
      {suggestions && suggestions.length > 0 && (
        <div className="mx-auto mb-3 flex max-w-3xl flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setValue(s)}
              className="flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <Sparkles className="h-3 w-3 text-primary" aria-hidden />
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="surface-floating mx-auto flex max-w-3xl flex-col rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-ring/60">
        {attachedName && (
          <div className="mb-2 flex w-fit items-center gap-2 rounded-md bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground">
            <Paperclip className="h-3 w-3" />
            {attachedName}
          </div>
        )}
        <div className="flex items-end gap-2">
          <button
            type="button"
            aria-label="Đính kèm tệp"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => setAttachedName(e.target.files?.[0]?.name ?? null)}
          />

          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder={placeholder ?? "Hỏi tiếp..."}
            aria-label="Nhập câu hỏi"
            className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            aria-label="Gửi"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
              value.trim() && !disabled
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground"
            )}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
        Nội dung do AI tổng hợp, luôn kèm trích dẫn — không thay thế tư vấn pháp lý chính thức.
      </p>
    </div>
  );
}

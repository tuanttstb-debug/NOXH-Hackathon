"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MessageBubble } from "@/features/workspace/message-bubble";
import type { ChatMessage } from "@/types/chat";
import type { Citation } from "@/types/legal";

export function ChatThread({
  messages,
  onOpenCitation,
  footer,
}: {
  messages: ChatMessage[];
  onOpenCitation?: (c: Citation) => void;
  /** Nội dung phụ hiển thị sau cùng trong luồng (vd. Checklist + Download ở Eligibility Checker). */
  footer?: ReactNode;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, footer]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} onOpenCitation={onOpenCitation} />
        ))}
        {footer}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

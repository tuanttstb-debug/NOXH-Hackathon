"use client";

import { useState } from "react";
import type { ChatMessage, ExtractedField, ReasoningStep, ResultBlock } from "@/types/chat";

const PENDING_STEPS: ReasoningStep[] = [
  { label: "Hiểu câu hỏi và trích xuất thông tin hồ sơ", status: "active" },
  { label: "Truy vấn Knowledge Graph — điều kiện liên quan", status: "pending" },
  { label: "Đối chiếu văn bản đang hiệu lực tại hôm nay", status: "pending" },
  { label: "Fact-Check trước khi trả lời", status: "pending" },
];

interface EligibilityApiSuccess {
  extractedFields: ExtractedField[];
  reasoningSteps: ReasoningStep[];
  result: ResultBlock;
}

interface EligibilityApiError {
  error: { code: string; message: string };
}

let idCounter = 1000;
const nextId = () => `m${idCounter++}`;

/**
 * Hook dùng chung cho mọi màn hình có luồng hội thoại Eligibility (AI Workspace — skill
 * "Kiểm tra điều kiện" — và Eligibility Checker độc lập). Gọi pipeline thật qua `/api/eligibility`
 * (xem `app/api/eligibility/route.ts`) — mỗi lượt gửi độc lập (single-shot, không giữ ngữ cảnh
 * hội thoại giữa các lượt, theo quyết định đã chốt: Agent không hỏi lại người dùng khi thiếu
 * thông tin, chỉ báo "Thiếu thông tin" và dừng).
 */
export function useEligibilityChat(seed: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [isThinking, setIsThinking] = useState(false);

  async function send(text: string) {
    const timestamp = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = { id: nextId(), role: "user", text, timestamp };

    const assistantId = nextId();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      reasoningSteps: PENDING_STEPS,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsThinking(true);

    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data: EligibilityApiSuccess | EligibilityApiError = await res.json();

      if (!res.ok || "error" in data) {
        const message = "error" in data ? data.error.message : `Lỗi HTTP ${res.status}`;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  reasoningSteps: undefined,
                  text: `Đã xảy ra lỗi khi xử lý yêu cầu: ${message}`,
                }
              : m
          )
        );
        return;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                extractedFields: data.extractedFields,
                reasoningSteps: data.reasoningSteps,
                result: data.result,
              }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                reasoningSteps: undefined,
                text: `Không thể kết nối tới máy chủ: ${err instanceof Error ? err.message : "lỗi không xác định"}`,
              }
            : m
        )
      );
    } finally {
      setIsThinking(false);
    }
  }

  return { messages, isThinking, send };
}

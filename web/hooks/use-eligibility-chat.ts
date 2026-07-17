"use client";

import { useState } from "react";
import { initialThread, notEligibleResult, hasHouseResult } from "@/mock/chat-thread";
import type { ChatMessage, ReasoningStep, ResultBlock } from "@/types/chat";

const DEMO_REASONING_TEMPLATE: ReasoningStep[] = [
  { label: "Hiểu câu hỏi và trích xuất thông tin hồ sơ", status: "pending" },
  { label: "Truy vấn Knowledge Graph — điều kiện liên quan", status: "pending" },
  { label: "Đối chiếu văn bản đang hiệu lực tại hôm nay", status: "pending" },
  { label: "Fact-Check trước khi trả lời", status: "pending" },
];

let idCounter = 1000;
const nextId = () => `m${idCounter++}`;

function pickResult(text: string): ResultBlock {
  const t = text.toLowerCase();
  const hasHighIncome = /4[0-9]\s*triệu|5\d\s*triệu|60\s*triệu|vượt\s*trần/.test(t);
  const hasHouse = /đã có nhà|có nhà rồi|đang có nhà|đã sở hữu nhà/.test(t);
  const isUncertain =
    /nuôi con|có con|con dưới|đơn thân|không chắc|chưa rõ|thiếu thông tin|chưa biết/.test(t);

  if (hasHouse) return hasHouseResult;
  if (hasHighIncome) return notEligibleResult;
  if (isUncertain && !text.includes("18 triệu") && !text.includes("12 triệu")) {
    return initialThread[3].result!;
  }
  return initialThread[1].result!;
}

/**
 * Hook dùng chung cho mọi màn hình có luồng hội thoại Eligibility (AI Workspace — skill
 * "Kiểm tra điều kiện" — và Eligibility Checker độc lập). Không có backend thật: mô phỏng
 * tiến trình suy luận tuần tự rồi gắn kết quả mẫu — đủ để demo UX đầu-cuối theo đúng yêu cầu
 * "Không cần backend thật, không cần API thật".
 */
export function useEligibilityChat(seed: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [isThinking, setIsThinking] = useState(false);

  function send(text: string) {
    const userMsg: ChatMessage = {
      id: nextId(),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    const assistantId = nextId();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      reasoningSteps: DEMO_REASONING_TEMPLATE.map((s, i) => ({
        ...s,
        status: i === 0 ? "active" : "pending",
      })),
      timestamp: userMsg.timestamp,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsThinking(true);

    DEMO_REASONING_TEMPLATE.forEach((_, i) => {
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  reasoningSteps: DEMO_REASONING_TEMPLATE.map((s, si) => ({
                    ...s,
                    status: si < i + 1 ? "done" : si === i + 1 ? "active" : "pending",
                  })),
                }
              : m
          )
        );
      }, (i + 1) * 550);
    });

    const chosenResult = pickResult(text);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                reasoningSteps: DEMO_REASONING_TEMPLATE.map((s) => ({ ...s, status: "done" })),
                result: chosenResult,
              }
            : m
        )
      );
      setIsThinking(false);
    }, DEMO_REASONING_TEMPLATE.length * 550 + 300);
  }

  return { messages, isThinking, send };
}

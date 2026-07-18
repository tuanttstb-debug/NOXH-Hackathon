"use client";

import { useState } from "react";
import type { ChatMessage, ExtractedField, ReasoningStep, ResultBlock } from "@/types/chat";

const PENDING_STEPS: ReasoningStep[] = [
  { label: "Hiểu câu hỏi và trích xuất thông tin hồ sơ", status: "active" },
  { label: "Truy vấn Knowledge Graph — điều kiện liên quan", status: "pending" },
  { label: "Đối chiếu văn bản đang hiệu lực tại hôm nay", status: "pending" },
  { label: "Fact-Check trước khi trả lời", status: "pending" },
];

/** Khớp `EligibilityProfile` ở `lib/eligibility/reasoner.ts` — chỉ để truyền qua lại, client không diễn giải. */
interface EligibilityProfile {
  maritalGroup: string | null;
  monthlyIncomeVnd: number | null;
  hasOwnHousing: boolean | null;
  residence: string | null;
}

interface EligibilityApiSuccess {
  extractedFields: ExtractedField[];
  reasoningSteps: ReasoningStep[];
  result: ResultBlock;
  profile: EligibilityProfile;
  followUpQuestion: string | null;
}

interface EligibilityApiError {
  error: { code: string; message: string };
}

let idCounter = 1000;
const nextId = () => `m${idCounter++}`;

/**
 * Hook dùng chung cho mọi màn hình có luồng hội thoại Eligibility (AI Workspace — skill
 * "Kiểm tra điều kiện" — và Eligibility Checker độc lập). Gọi pipeline thật qua `/api/eligibility`.
 *
 * HỘI THOẠI NHIỀU LƯỢT (2026-07-19) — thay cho single-shot trước đây:
 * hook giữ `profile` server trả về và gửi kèm lượt sau, nên người dùng có thể khai báo rải rác
 * ("Tôi đã kết hôn" → "Hai vợ chồng 40 triệu" → "Chưa có nhà") mà hồ sơ vẫn tích luỹ đủ.
 * Trước đây mỗi lượt độc lập nên lượt sau xoá sạch lượt trước và không bao giờ đủ dữ liệu để kết luận.
 *
 * Hồ sơ được gộp bằng CODE ở server (`mergeProfile`), không nhồi lịch sử hội thoại cho LLM —
 * giữ nguyên tính chất "input người dùng không đổi được verdict".
 */
export function useEligibilityChat(seed: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [isThinking, setIsThinking] = useState(false);
  const [profile, setProfile] = useState<EligibilityProfile | null>(null);

  /** Bắt đầu hồ sơ mới — xoá ngữ cảnh tích luỹ. Cần thiết vì `mergeProfile` không cho xoá từng trường. */
  function reset() {
    setProfile(null);
    setMessages(seed);
  }

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
        // `knownProfile` là toàn bộ cơ chế nhớ ngữ cảnh — server gộp nó với thông tin của lượt này.
        body: JSON.stringify({ message: text, knownProfile: profile }),
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

      // Lưu hồ sơ đã tích luỹ cho lượt kế tiếp.
      setProfile(data.profile);

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

  return { messages, isThinking, send, profile, reset };
}

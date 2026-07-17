import type { Citation, EligibilityVerdict } from "@/types/legal";

export type MessageRole = "user" | "assistant";

export interface ExtractedField {
  label: string;
  value: string;
}

export interface ReasoningStep {
  label: string;
  status: "done" | "active" | "pending";
}

/** Dữ liệu cho khối kết quả (Result Card) — ánh xạ EligibilityResult nhưng thêm phần hiển thị. */
export interface ResultBlock {
  verdict: EligibilityVerdict;
  headline: string;
  reason: string;
  threshold?: {
    label: string;
    userValue: number;
    limitValue: number;
    unit: string;
  };
  citations: Citation[];
  conflictingCitations?: [Citation, Citation]; // dùng cho verdict = insufficient_data
  suggestion?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text?: string;
  extractedFields?: ExtractedField[];
  reasoningSteps?: ReasoningStep[];
  result?: ResultBlock;
  timestamp: string;
}

export interface QuickSkill {
  id: string;
  label: string;
  description: string;
  icon: "eligibility" | "search" | "factcheck" | "diff";
}

export interface HistoryItem {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
}

/** Checklist chuẩn bị hồ sơ — chỉ hiển thị khi verdict = "eligible" (Eligibility Checker). */
export interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
}

import { NextResponse } from "next/server";
import { composeAnswer, extractProfile } from "@/lib/eligibility/llm";
import { factCheck, findMissingFields, reasonEligibility, type DraftConclusion } from "@/lib/eligibility/reasoner";
import { getThresholdForGroup } from "@/lib/eligibility/legal-kg";
import type { ExtractedField, ReasoningStep, ResultBlock } from "@/types/chat";

/**
 * Pipeline Eligibility Checker thật (thay `pickResult()` giả lập ở `hooks/use-eligibility-chat.ts`).
 * Thứ tự đúng `knowledge/agents/eligibility.md`:
 * 1. Parse (LLM — extractProfile)      2. Validate (code — findMissingFields)
 * 3. legal_reasoner (code — reasonEligibility)   4. fact_check (code — factCheck)
 * 5. Soạn câu trả lời cuối (LLM — composeAnswer, KHÔNG được đổi kết luận ở bước 3-4)
 */

const REASONING_LABELS = [
  "Hiểu câu hỏi và trích xuất thông tin hồ sơ",
  "Truy vấn Knowledge Graph — điều kiện liên quan",
  "Đối chiếu văn bản đang hiệu lực tại hôm nay",
  "Fact-Check trước khi trả lời",
] as const;

function headlineFor(verdict: DraftConclusion["verdict"]): string {
  if (verdict === "eligible") return "ĐỦ ĐIỀU KIỆN mua Nhà ở xã hội";
  if (verdict === "not_eligible") return "KHÔNG ĐỦ ĐIỀU KIỆN mua Nhà ở xã hội";
  return "CHƯA ĐỦ CĂN CỨ ĐỂ KẾT LUẬN CHẮC CHẮN";
}

function maritalLabel(group: string | null): string {
  if (!group) return "(chưa cung cấp)";
  return getThresholdForGroup(group as Parameters<typeof getThresholdForGroup>[0])?.label ?? group;
}

export async function POST(req: Request) {
  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_BODY", message: "Body phải là JSON hợp lệ." } },
      { status: 400 }
    );
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json(
      { error: { code: "MISSING_MESSAGE", message: "Thiếu trường 'message'." } },
      { status: 400 }
    );
  }

  const steps: ReasoningStep[] = REASONING_LABELS.map((label) => ({ label, status: "pending" as const }));

  let profile;
  try {
    profile = await extractProfile(message);
  } catch (err) {
    return NextResponse.json(
      {
        error: {
          code: "LLM_PROVIDER_ERROR",
          message: err instanceof Error ? err.message : "Lỗi không xác định khi gọi FPT AI (bước trích xuất).",
        },
      },
      { status: 502 }
    );
  }
  steps[0].status = "done";

  let draft: DraftConclusion;
  const missingFields = findMissingFields(profile);
  if (missingFields.length > 0) {
    // Đúng agents/eligibility.md #1: thiếu trường bắt buộc → Thiếu thông tin ngay, KHÔNG gọi legal_reasoner.
    draft = { verdict: "insufficient_data", reasonKey: "insufficient_missing_fields", citations: [], missingFields };
  } else {
    steps[1].status = "done";
    draft = factCheck(reasonEligibility(profile));
    steps[2].status = "done";
    steps[3].status = "done";
  }

  let composed;
  try {
    composed = await composeAnswer(profile, draft);
  } catch (err) {
    return NextResponse.json(
      {
        error: {
          code: "LLM_PROVIDER_ERROR",
          message: err instanceof Error ? err.message : "Lỗi không xác định khi gọi FPT AI (bước soạn câu trả lời).",
        },
      },
      { status: 502 }
    );
  }

  const result: ResultBlock = {
    verdict: draft.verdict,
    headline: headlineFor(draft.verdict),
    reason: composed.reason,
    threshold: draft.threshold,
    citations: draft.citations,
    conflictingCitations: draft.conflictingCitations,
    suggestion: composed.suggestion,
  };

  const extractedFields: ExtractedField[] = [
    { label: "Tình trạng hôn nhân", value: maritalLabel(profile.maritalGroup) },
    {
      label: "Thu nhập",
      value:
        profile.monthlyIncomeVnd != null
          ? `${profile.monthlyIncomeVnd.toLocaleString("vi-VN")} đ/tháng`
          : "(chưa cung cấp)",
    },
    {
      label: "Tình trạng nhà ở",
      value: profile.hasOwnHousing === null ? "(chưa cung cấp)" : profile.hasOwnHousing ? "Đã có nhà" : "Chưa có nhà",
    },
    { label: "Nơi cư trú", value: profile.residence ?? "(chưa cung cấp)" },
  ];

  return NextResponse.json({ extractedFields, reasoningSteps: steps, result });
}

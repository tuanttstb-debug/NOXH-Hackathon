import { NextResponse } from "next/server";
import { composeAnswer, extractProfile } from "@/lib/eligibility/llm";
import { classifyIntent } from "@/lib/eligibility/intent";
import { answerLegalQuestion } from "@/lib/eligibility/legal-answer";
import {
  factCheck,
  mergeProfile,
  reasonEligibility,
  type DraftConclusion,
  type EligibilityProfile,
} from "@/lib/eligibility/reasoner";
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

/** Chuỗi bước riêng cho câu hỏi TRA CỨU pháp lý — không đi qua legal_reasoner/fact_check hồ sơ. */
const LOOKUP_REASONING_LABELS = [
  "Nhận diện đây là câu hỏi tra cứu văn bản",
  "Truy xuất điều khoản liên quan từ Knowledge Graph",
  "Đối chiếu tình trạng hiệu lực của từng điều khoản",
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

/**
 * Câu hỏi gợi mở cho từng trường còn thiếu — hội thoại nhiều lượt (quyết định 2026-07-19,
 * trả lời OPEN QUESTION #2 vốn treo từ Session 4: agent CÓ hỏi lại thay vì báo thiếu rồi dừng).
 * Đặt ở tầng code, không để LLM tự nghĩ câu hỏi, để nội dung hỏi luôn khớp đúng trường mà
 * `findMissingFields()` xác định — tránh agent hỏi lệch thứ đang thiếu.
 */
const FOLLOW_UP_QUESTIONS: Record<string, string> = {
  "Tình trạng hôn nhân": "Bạn cho mình biết hiện tại bạn độc thân, đang một mình nuôi con, hay đã kết hôn?",
  "Thu nhập hàng tháng": "Thu nhập hàng tháng của bạn khoảng bao nhiêu? (nếu đã kết hôn thì là tổng của hai vợ chồng)",
  "Tình trạng nhà ở": "Hiện bạn đã có nhà thuộc sở hữu của mình chưa?",
};

export async function POST(req: Request) {
  let body: { message?: string; knownProfile?: EligibilityProfile };
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

  let profile: EligibilityProfile;
  let extracted: EligibilityProfile;
  try {
    // Trích xuất từ RIÊNG lượt này, rồi gộp bằng code với hồ sơ đã tích luỹ các lượt trước.
    extracted = await extractProfile(message);
    profile = mergeProfile(body.knownProfile, extracted);
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

  /*
   * ĐỊNH TUYẾN Ý ĐỊNH (sửa lỗi 2026-07-19).
   * Trước bản này mọi câu hỏi đều bị đẩy qua luồng xét điều kiện — câu "So sánh Nghị định
   * 261/2025 và 136/2026" cho ra hồ sơ rỗng rồi hệ thống hỏi ngược tình trạng hôn nhân.
   */
  if (classifyIntent(message, extracted, body.knownProfile) === "legal_lookup") {
    const lookupSteps: ReasoningStep[] = LOOKUP_REASONING_LABELS.map((label) => ({
      label,
      status: "done" as const,
    }));

    let answer;
    try {
      answer = await answerLegalQuestion(message);
    } catch (err) {
      return NextResponse.json(
        {
          error: {
            code: "LLM_PROVIDER_ERROR",
            message: err instanceof Error ? err.message : "Lỗi không xác định khi tra cứu văn bản.",
          },
        },
        { status: 502 }
      );
    }

    // Không tìm thấy điều khoản nào → nói thẳng là chưa có dữ liệu, KHÔNG để LLM bịa.
    // Knowledge Graph hiện chỉ nạp 4 văn bản lõi (xem PROJECT_STATE.md).
    if (!answer) {
      return NextResponse.json({
        extractedFields: [],
        reasoningSteps: lookupSteps.map((s, i) => (i === 0 ? s : { ...s, status: "pending" as const })),
        result: {
          verdict: "legal_answer",
          headline: "Chưa có dữ liệu về văn bản này",
          reason:
            "Câu hỏi của bạn nhắc tới văn bản chưa được nạp vào Knowledge Graph. Hệ thống hiện chỉ đối chiếu " +
            "toàn văn 4 nghị định lõi về Nhà ở xã hội (100/2024, 261/2025, 54/2026, 136/2026). " +
            "Mình không trả lời dựa trên suy đoán, nên xin phép dừng ở đây thay vì đưa thông tin có thể sai.",
          citations: [],
          suggestion: "Bạn thử hỏi về một trong 4 nghị định trên, hoặc mở màn hình Tra cứu pháp lý để xem toàn bộ điều khoản đang có.",
        },
        profile,
        followUpQuestion: null,
      });
    }

    return NextResponse.json({
      extractedFields: [],
      reasoningSteps: lookupSteps,
      result: {
        verdict: "legal_answer",
        headline: answer.headline,
        reason: answer.reason,
        citations: answer.citations,
        suggestion: answer.suggestion,
      },
      // Giữ nguyên hồ sơ đang tích luỹ — hỏi xen một câu tra cứu KHÔNG được xoá ngữ cảnh hồ sơ.
      profile,
      followUpQuestion: null,
    });
  }

  /*
   * `reasonEligibility()` là NGUỒN DUY NHẤT quyết định kết luận, kể cả nhánh "thiếu trường bắt buộc".
   * Trước 2026-07-19 route tự gọi `findMissingFields()` rồi short-circuit TRƯỚC khi vào reasoner —
   * logic bị nhân đôi, và khi reasoner thêm nhánh mới (THUÊ được miễn điều kiện thu nhập/nhà ở)
   * thì cổng ở route chặn mất, người muốn thuê vẫn bị hỏi hôn nhân/thu nhập. Đừng dựng lại cổng này.
   */
  const draft: DraftConclusion = factCheck(reasonEligibility(profile));

  if (draft.reasonKey === "insufficient_missing_fields") {
    // Dừng sớm ngay sau bước Parse — các bước sau KHÔNG chạy, nên giữ nguyên trạng thái `pending`
    // để thanh reasoning phản ánh đúng sự thật (xem reasoning-trace.tsx).
  } else {
    steps[1].status = "done";
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
    // Người THUÊ được miễn điều kiện thu nhập/nhà ở, nhưng vẫn phải thuộc nhóm đối tượng Điều 76 —
    // headline phải nói đúng phạm vi kết luận, không hứa hẹn quá thứ hệ thống thực sự kiểm được.
    headline:
      draft.reasonKey === "eligible_rent_exempt"
        ? "KHÔNG BỊ RÀNG BUỘC ĐIỀU KIỆN THU NHẬP VÀ NHÀ Ở (thuê NOXH)"
        : headlineFor(draft.verdict),
    reason: composed.reason,
    threshold: draft.threshold,
    citations: draft.citations,
    conflictingCitations: draft.conflictingCitations,
    suggestion: composed.suggestion,
    reasonKey: draft.reasonKey,
  };

  /*
   * Người bị loại vì thu nhập/nhà ở mà CHƯA nêu hình thức: kết luận đó chỉ đúng cho MUA và
   * THUÊ MUA. Luật Nhà ở Điều 78 khoản 2 miễn cả hai điều kiện nếu họ chỉ THUÊ — đây là lối thoát
   * thật sự, không nói ra là bỏ mặc người dùng ở kết luận sai phạm vi.
   * Ghép bằng CODE, không giao cho LLM: prompt có dặn nhưng LLM bỏ qua không ổn định (đã đo).
   */
  if (draft.verdict === "not_eligible" && profile.intendedForm === null) {
    result.reason +=
      " Lưu ý: kết luận này áp dụng cho hình thức MUA hoặc THUÊ MUA. Nếu bạn chỉ có nhu cầu THUÊ nhà ở xã hội thì theo Luật Nhà ở Điều 78 khoản 2, bạn không phải đáp ứng điều kiện về thu nhập và nhà ở.";
  }

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

  // Hình thức quyết định có áp điều kiện thu nhập/nhà ở hay không (Luật Điều 78 k2) — hiện ra để
  // người dùng thấy hệ thống hiểu đúng nhu cầu của họ và sửa được nếu sai.
  if (profile.intendedForm) {
    const formLabel = { mua: "Mua", thue_mua: "Thuê mua", thue: "Thuê" }[profile.intendedForm];
    extractedFields.push({ label: "Hình thức", value: formLabel });
  }

  // Chỉ hiện diện tích khi người dùng ĐÃ CÓ nhà — với người chưa có nhà thì trường này vô nghĩa
  // và hiện ra chỉ làm rối (điều kiện diện tích chỉ áp dụng cho trường hợp đã sở hữu nhà).
  if (profile.hasOwnHousing === true) {
    extractedFields.push({
      label: "Diện tích bình quân",
      value:
        profile.housingAreaPerPersonM2 != null
          ? `${profile.housingAreaPerPersonM2} m²/người`
          : "(chưa cung cấp)",
    });
  }

  // Hỏi lại đúng trường còn thiếu ĐẦU TIÊN — hỏi từng câu một, không dồn 3 câu cùng lúc
  // (dồn lại khiến người dùng bỏ sót và quay về đúng trạng thái bế tắc trước đây).
  const followUpQuestion =
    draft.verdict === "insufficient_data" && draft.missingFields?.length
      ? FOLLOW_UP_QUESTIONS[draft.missingFields[0]] ?? null
      : draft.reasonKey === "insufficient_housing_area_unknown"
        ? // Có nhà nhưng chưa biết diện tích bình quân — hỏi đúng thứ còn thiếu để kết luận được,
          // thay vì dừng ở "không đủ điều kiện" như bản cũ (vốn sai luật).
          "Căn nhà hiện tại của bạn rộng khoảng bao nhiêu m², và có mấy người cùng đăng ký thường trú ở đó?"
        : null;
  if (followUpQuestion) {
    result.suggestion = followUpQuestion;
  }

  return NextResponse.json({
    extractedFields,
    reasoningSteps: steps,
    result,
    // Client giữ lại và gửi kèm lượt sau — đây là toàn bộ cơ chế nhớ ngữ cảnh.
    profile,
    followUpQuestion,
  });
}

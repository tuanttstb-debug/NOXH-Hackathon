/**
 * Client gọi FPT AI Marketplace (endpoint OpenAI-compatible, đã xác minh thật:
 * POST {base}/v1/chat/completions, GET {base}/v1/models).
 *
 * Chỉ chạy phía server (Route Handler) — KHÔNG import từ component "use client".
 * Tách ra khỏi `lib/eligibility/llm.ts` khi module thứ hai cần dùng, để không nhân bản
 * phần xử lý lỗi/fallback đã kiểm chứng thật với model production.
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callChat(messages: ChatMessage[], temperature = 0.2): Promise<string> {
  const apiKey = process.env.MKP_API_KEY;
  const baseUrl = process.env.MKP_API_BASE;
  const model = process.env.MKP_API_MODEL;

  if (!apiKey || !baseUrl || !model) {
    throw new Error(
      "Thiếu cấu hình MKP (MKP_API_KEY / MKP_API_BASE / MKP_API_MODEL) — điền vào web/.env.local theo web/.env.local.example."
    );
  }

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature, response_format: { type: "json_object" } }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`MKP AI trả lỗi HTTP ${res.status}: ${errBody.slice(0, 500)}`);
  }

  const data = await res.json();
  const message = data?.choices?.[0]?.message;
  // Một số model trên marketplace này (DeepSeek-V4-Flash, GLM-5.2, ...) là model "reasoning" —
  // mặc định đẩy toàn bộ output vào `reasoning_content` và để `content` = null. Model đã chọn
  // (SaoLa3.1-medium) không gặp vấn đề này, nhưng fallback ở đây để đổi model không làm gãy code.
  const content: string | undefined | null = message?.content ?? message?.reasoning_content;
  if (!content) {
    throw new Error("MKP AI trả về response không có nội dung (message.content và reasoning_content đều rỗng).");
  }
  return content;
}

/** Bóc JSON khỏi response — chấp nhận trường hợp model bọc trong ```json ... ``` dù đã yêu cầu JSON thuần. */
export function extractJson<T>(raw: string): T | null {
  const cleaned = raw.trim().replace(/^```json\s*|^```\s*|```$/gim, "");
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

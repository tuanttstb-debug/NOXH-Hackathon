"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResultBlock } from "@/types/chat";

const VERDICT_LABEL: Record<ResultBlock["verdict"], string> = {
  eligible: "ĐỦ ĐIỀU KIỆN",
  not_eligible: "KHÔNG ĐỦ ĐIỀU KIỆN",
  insufficient_data: "CHƯA ĐỦ CĂN CỨ",
};

/** Sinh file tóm tắt kết quả dạng text ngay trên trình duyệt — không gọi backend. */
function buildSummaryText(result: ResultBlock): string {
  const lines: string[] = [];
  lines.push("NOXH COPILOT — TÓM TẮT KẾT QUẢ KIỂM TRA ĐIỀU KIỆN");
  lines.push("=".repeat(52));
  lines.push(`Kết luận: ${VERDICT_LABEL[result.verdict]}`);
  lines.push("");
  lines.push(result.headline);
  lines.push("");
  lines.push("Lý do:");
  lines.push(result.reason);

  if (result.threshold) {
    const { label, userValue, limitValue, unit } = result.threshold;
    lines.push("");
    lines.push(`Đối chiếu ngưỡng — ${label}: ${userValue} / ${limitValue} ${unit}`);
  }

  if (result.citations.length > 0) {
    lines.push("");
    lines.push("Căn cứ pháp lý:");
    result.citations.forEach((c) => {
      lines.push(`- ${c.articleLabel} — ${c.documentTitle} (${c.documentCode})`);
    });
  }

  if (result.suggestion) {
    lines.push("");
    lines.push(`Gợi ý tiếp theo: ${result.suggestion}`);
  }

  lines.push("");
  lines.push("—");
  lines.push(
    "Lưu ý: kết quả tạo tự động từ dữ liệu đang trong quá trình xác minh, chỉ mang tính tham khảo, không thay thế xác nhận từ cơ quan có thẩm quyền."
  );
  lines.push(`Xuất lúc: ${new Date().toLocaleString("vi-VN")}`);

  return lines.join("\n");
}

export function DownloadSummaryButton({ result }: { result: ResultBlock }) {
  function handleDownload() {
    const text = buildSummaryText(result);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "noxh-copilot-ket-qua.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
      <Download className="h-4 w-4" />
      Tải tóm tắt kết quả
    </Button>
  );
}

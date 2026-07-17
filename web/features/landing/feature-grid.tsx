import { Network, BrainCircuit, BookMarked, FileCheck2, Eye, History } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** 6 giá trị cốt lõi — đối chiếu docs/01_TONG_QUAN_DU_AN.md */
const features: Feature[] = [
  {
    icon: Network,
    title: "Knowledge Graph",
    description:
      "Toàn bộ Luật, Nghị định được mô hình hoá thành đồ thị tri thức — biết điều khoản nào đang hiệu lực, điều khoản nào đã bị thay thế.",
  },
  {
    icon: BrainCircuit,
    title: "Legal Reasoning",
    description:
      "AI Agent suy luận có kiểm soát: Parse → Retrieve → Reasoning → Fact-Check — không trả lời từ tri thức nội tại chưa kiểm chứng.",
  },
  {
    icon: FileCheck2,
    title: "Fact Check bắt buộc",
    description:
      "Mọi kết luận đều được đối chiếu lại với Knowledge Graph trước khi tới bạn — không phải bước tuỳ chọn.",
  },
  {
    icon: BookMarked,
    title: "Citation First",
    description:
      "Không có câu trả lời nào thiếu trích dẫn điều/khoản/văn bản/ngày hiệu lực cụ thể.",
  },
  {
    icon: Eye,
    title: "Explainable AI",
    description:
      "Luôn có thể mở ra xem vì sao AI kết luận như vậy — không phải hộp đen.",
  },
  {
    icon: History,
    title: "Nhận biết thời hiệu",
    description:
      "Hệ thống biết văn bản nào vừa sửa đổi, tránh trích dẫn điều khoản đã hết hiệu lực — rủi ro lớn nhất khi tra cứu luật thủ công.",
  },
];

export function FeatureGrid() {
  return (
    <section id="kha-nang" className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Không phải chatbot. Là hạ tầng trí tuệ pháp lý.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Sáu năng lực cốt lõi tạo nên NOXH Copilot — mỗi năng lực đều là một quyết định
          kiến trúc có chủ đích, không phải tính năng trang trí.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="p-1">
            <CardHeader>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <CardTitle className="pt-3">{f.title}</CardTitle>
              <CardDescription>{f.description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </section>
  );
}

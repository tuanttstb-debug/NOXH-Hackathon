import { User, Building2, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UseCase {
  icon: LucideIcon;
  audience: string;
  status: "available" | "soon";
  question: string;
  value: string;
}

/** Đối chiếu docs/UI/03_USER_JOURNEY.md */
const useCases: UseCase[] = [
  {
    icon: User,
    audience: "Người dân",
    status: "available",
    question: "Tôi có đủ điều kiện mua NOXH không?",
    value: "Biết chắc kết quả và vì sao, không cần đọc văn bản luật.",
  },
  {
    icon: Building2,
    audience: "Doanh nghiệp & Ngân hàng",
    status: "soon",
    question: "Hồ sơ này có đáp ứng điều kiện giải ngân ưu đãi không?",
    value: "Tra cứu theo lô, theo dõi thay đổi ảnh hưởng tới nghiệp vụ.",
  },
  {
    icon: Landmark,
    audience: "Cơ quan quản lý",
    status: "soon",
    question: "Văn bản mới có xung đột với quy định hiện hành không?",
    value: "Phát hiện sớm chồng lấp pháp lý trước khi ban hành rộng rãi.",
  },
];

export function UseCaseSection() {
  return (
    <section id="use-case" className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Dành cho ai</h2>
        <p className="mt-3 text-muted-foreground">
          Một nền tảng, ba đối tượng — mỗi đối tượng một cách làm việc phù hợp,
          cùng chung một nguồn tri thức pháp lý.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {useCases.map((uc) => (
          <Card key={uc.audience} className="flex flex-col p-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <uc.icon className="h-5 w-5" />
                </span>
                {uc.status === "soon" && (
                  <Badge variant="secondary">Sắp ra mắt</Badge>
                )}
              </div>
              <CardTitle className="pt-3">{uc.audience}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <p className="rounded-lg bg-muted/40 p-3 text-sm italic text-foreground/90">
                “{uc.question}”
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">{uc.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

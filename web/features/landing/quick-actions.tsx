import Link from "next/link";
import { ShieldCheck, FileSearch, ScanSearch, GitCompareArrows } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuickAction {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  available: boolean;
}

const actions: QuickAction[] = [
  {
    icon: ShieldCheck,
    title: "Kiểm tra điều kiện",
    description: "Trả lời vài câu, biết ngay bạn có đủ điều kiện mua NOXH không.",
    href: "/workspace",
    available: true,
  },
  {
    icon: FileSearch,
    title: "Tra cứu văn bản",
    description: "Tìm đúng điều khoản đang hiệu lực, không lo dùng bản đã hết hạn.",
    href: "/workspace",
    available: false,
  },
  {
    icon: ScanSearch,
    title: "Fact Check tin tức",
    description: "Dán tin tức/bài đăng — AI đối chiếu với luật thật, có trích dẫn.",
    href: "/workspace",
    available: false,
  },
  {
    icon: GitCompareArrows,
    title: "So sánh văn bản",
    description: "Xem 2 nghị định khác nhau ở đâu, ảnh hưởng gì tới bạn.",
    href: "/workspace",
    available: false,
  },
];

function ActionCardBody({ action }: { action: QuickAction }) {
  return (
    <Card className="group relative h-full p-5 transition-transform hover:-translate-y-0.5 hover:border-primary/40">
      {!action.available && (
        <Badge variant="secondary" className="absolute right-3 top-3">
          Sắp ra mắt
        </Badge>
      )}
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <action.icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-sm font-semibold">{action.title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{action.description}</p>
    </Card>
  );
}

export function QuickActions() {
  return (
    <section className="container -mt-6 pb-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) =>
          action.available ? (
            <Link key={action.title} href={action.href} className="block cursor-pointer">
              <ActionCardBody action={action} />
            </Link>
          ) : (
            <div key={action.title} className="cursor-not-allowed opacity-80">
              <ActionCardBody action={action} />
            </div>
          )
        )}
      </div>
    </section>
  );
}

import { Scale } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Scale className="h-4 w-4 text-primary" />
            NOXH Copilot
          </div>
          <p className="max-w-md text-center text-xs text-muted-foreground sm:text-right">
            Nội dung pháp lý hiển thị mang tính tham khảo, đang trong quá trình xác minh
            với văn bản gốc. Không thay thế tư vấn pháp lý chính thức.
          </p>
        </div>
        <Separator className="my-6" />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} NOXH Copilot — AI Legal Intelligence Platform. Prototype Hackathon.
        </p>
      </div>
    </footer>
  );
}

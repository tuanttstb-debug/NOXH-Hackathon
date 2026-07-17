import Link from "next/link";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#kha-nang", label: "Khả năng" },
  { href: "#kien-truc", label: "Kiến trúc" },
  { href: "#use-case", label: "Use Case" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Scale className="h-4 w-4" />
          </span>
          <span>
            NOXH <span className="text-primary">Copilot</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Đăng nhập
          </Button>
          <Button size="sm" asChild>
            <Link href="/workspace">Bắt đầu ngay</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

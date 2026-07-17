import type { Metadata } from "next";
import "./globals.css";

// Không dùng next/font/google (tải Inter qua mạng lúc build) — dùng font-stack hệ thống
// tương đồng Inter để không phụ thuộc mạng khi build/demo (an toàn hơn khi demo trực tiếp,
// tự host Inter là việc có thể làm sau, không ảnh hưởng UI). Xem tailwind.config.ts fontFamily.

export const metadata: Metadata = {
  title: "NOXH Copilot — AI Legal Intelligence Platform",
  description:
    "Nền tảng AI Legal Knowledge Graph giúp người dân, doanh nghiệp và cơ quan quản lý hiểu đúng quy định về Nhà ở xã hội — có căn cứ, có trích dẫn, có thời hiệu.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className="dark">
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}

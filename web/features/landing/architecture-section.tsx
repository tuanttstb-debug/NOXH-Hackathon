"use client";

import { motion } from "framer-motion";
import { MessageSquare, Workflow, ShieldCheck, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Đối chiếu docs/05_KIEN_TRUC_GIAI_PHAP.md — mô hình 3 lớp */
const steps: Step[] = [
  {
    icon: MessageSquare,
    title: "Conversation",
    description: "Bạn hỏi bằng ngôn ngữ tự nhiên — không form, không wizard.",
  },
  {
    icon: Workflow,
    title: "Reasoning trên Knowledge Graph",
    description:
      "AI Agent truy vấn đồ thị tri thức pháp lý, chỉ dùng điều khoản đang hiệu lực tại thời điểm hỏi.",
  },
  {
    icon: ShieldCheck,
    title: "Fact-Check & Citation",
    description:
      "Kết luận được kiểm chứng lại trước khi trả lời, luôn kèm trích dẫn nguồn cụ thể.",
  },
];

export function ArchitectureSection() {
  return (
    <section id="kien-truc" className="border-y border-border/60 bg-muted/20 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Grounding trước, Generation sau
          </h2>
          <p className="mt-3 text-muted-foreground">
            Nguyên tắc kiến trúc duy nhất chi phối mọi quyết định thiết kế —
            AI không được trả lời pháp lý nếu chưa có căn cứ từ Knowledge Graph.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {steps.map((step, i) => (
            <>
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="surface-floating flex flex-col items-center rounded-xl p-6 text-center"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <step.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="hidden items-center justify-center md:flex" aria-hidden>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

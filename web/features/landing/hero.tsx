"use client";

import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import { AiSearchBar } from "@/features/landing/ai-search-bar";
import { Badge } from "@/components/ui/badge";
import { legalDocuments } from "@/mock/legal-documents";

const latestDoc = legalDocuments.reduce((latest, doc) =>
  new Date(doc.effectiveDate) > new Date(latest.effectiveDate) ? doc : latest
);

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-24 sm:pt-32">
      <div className="container flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-6">
            <Clock3 className="h-3 w-3" />
            Cập nhật gần nhất: {latestDoc.code} · {new Date(latestDoc.effectiveDate).toLocaleDateString("vi-VN")}
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Hiểu đúng quy định{" "}
          <span className="text-gradient-brand">Nhà ở xã hội</span> —
          có căn cứ, không đoán mò
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          NOXH Copilot là nền tảng AI Legal Intelligence — không phải chatbot.
          Mọi câu trả lời đều truy vấn Knowledge Graph pháp lý, được kiểm chứng
          trước khi tới bạn, và luôn kèm trích dẫn điều khoản còn hiệu lực.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 w-full"
        >
          <AiSearchBar />
        </motion.div>
      </div>
    </section>
  );
}

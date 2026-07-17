"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ReasoningTrace } from "@/features/workspace/reasoning-trace";
import { ResultCard } from "@/features/workspace/result-card";
import type { ChatMessage } from "@/types/chat";
import type { Citation } from "@/types/legal";

export function MessageBubble({
  message,
  onOpenCitation,
}: {
  message: ChatMessage;
  onOpenCitation?: (c: Citation) => void;
}) {
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary/15 px-4 py-2.5 text-sm text-foreground">
          {message.text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        NOXH Copilot
      </div>

      {message.extractedFields && message.extractedFields.length > 0 && (
        <div className="ml-8 flex flex-wrap gap-2">
          {message.extractedFields.map((f) => (
            <span
              key={f.label}
              className="rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs text-success"
            >
              {f.label}: <span className="font-medium">{f.value}</span>
            </span>
          ))}
        </div>
      )}

      {message.reasoningSteps && (
        <div className="ml-8">
          <ReasoningTrace steps={message.reasoningSteps} />
        </div>
      )}

      {message.result && (
        <div className="ml-8">
          <ResultCard result={message.result} onOpenCitation={onOpenCitation} />
        </div>
      )}
    </motion.div>
  );
}

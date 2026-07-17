"use client";

import { useEffect, useState } from "react";

/**
 * Hiệu ứng gõ chữ tuần tự qua danh sách câu — dùng cho placeholder ô tìm kiếm AI ở Hero.
 * Micro-interaction nhẹ, không lặp lại cầu kỳ, đúng nguyên tắc "chuyển động có mục đích"
 * ở docs/UI/07_DESIGN_SYSTEM.md mục 5.
 */
export function useTypingEffect(phrases: string[], speed = 45, pause = 1800) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex % phrases.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), speed);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), speed / 2);
    } else {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex, phrases, speed, pause]);

  return text;
}

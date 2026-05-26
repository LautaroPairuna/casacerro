"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  duration?: number;
  amount?: number;
  style?: CSSProperties;
};

export default function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  duration = 0.6,
  amount = 0.3,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.visible = "true";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.visible = "true";
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: Math.min(Math.max(amount, 0), 1) }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount]);

  const mergedStyle = {
    ...style,
    ["--reveal-delay" as string]: `${delay}s`,
    ["--reveal-duration" as string]: `${duration}s`,
  } as CSSProperties;

  return (
    <Tag ref={ref} data-reveal className={className} style={mergedStyle}>
      {children}
    </Tag>
  );
}

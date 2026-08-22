"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function ArrowRight({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Чёрная пилюля с белым кружком и стрелкой. Подпись из ТЗ. */
export function PillButton({
  children,
  onClick,
  disabled,
  tone = "dark",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center gap-3 rounded-full pl-7 pr-2 py-2 text-base font-medium transition-all duration-200 disabled:opacity-35",
        dark ? "bg-ink text-white active:bg-neutral-800" : "bg-white text-ink",
      ].join(" ")}
    >
      <span>{children}</span>
      <span
        className={[
          "flex items-center justify-center rounded-full p-2",
          dark ? "bg-white text-ink" : "bg-ink text-white",
        ].join(" ")}
      >
        <ArrowRight className="w-4 h-4" />
      </span>
    </button>
  );
}

/** Крупный заголовок экрана в стиле Halo: тугой трекинг, вес 600. */
export function Title({
  children,
  size = "lg",
}: {
  children: ReactNode;
  size?: "lg" | "xl";
}) {
  return (
    <h1
      className={[
        "font-semibold leading-[1.05] text-ink",
        size === "xl" ? "text-[40px] sm:text-6xl" : "text-[30px] sm:text-5xl",
      ].join(" ")}
      style={{ letterSpacing: "-0.04em" }}
    >
      {children}
    </h1>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="text-[17px] sm:text-xl leading-relaxed text-ink/60 max-w-md">
      {children}
    </p>
  );
}

/** Полоска прогресса по вопросам. Двигается плавно, без скачков. */
export function Progress({ value }: { value: number }) {
  return (
    <div className="h-1 w-full rounded-full bg-hair overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-ink"
        initial={false}
        animate={{ width: `${Math.round(value * 100)}%` }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/** Карточка варианта ответа. Выбор подтверждается мягко. */
export function OptionCard({
  label,
  selected,
  onClick,
  multi = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={[
        "w-full text-left rounded-2xl px-5 py-4 flex items-center gap-4 transition-colors duration-200 border",
        selected
          ? "bg-violet-900 text-white border-violet-900"
          : "bg-white text-ink border-transparent",
      ].join(" ")}
    >
      <span
        className={[
          "shrink-0 flex items-center justify-center transition-all duration-200",
          multi ? "w-5 h-5 rounded-md" : "w-5 h-5 rounded-full",
          selected ? "bg-white" : "bg-transparent ring-1 ring-ink/20",
        ].join(" ")}
      >
        {selected ? (
          <svg viewBox="0 0 16 16" className="w-3 h-3 text-violet-900" aria-hidden="true">
            <path
              d="M3 8.5l3.2 3.2L13 5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        ) : null}
      </span>
      <span className="text-[16px] leading-snug font-medium">{label}</span>
    </motion.button>
  );
}

/** Оболочка экрана: шапка с прогрессом, тело, липкий низ с кнопкой. */
export function Screen({
  progress,
  step,
  total,
  children,
  footer,
  tight = false,
}: {
  progress?: number;
  step?: number;
  total?: number;
  children: ReactNode;
  footer?: ReactNode;
  /** Экран помещается целиком, запас под липкую кнопку не нужен */
  tight?: boolean;
}) {
  return (
    <div className="screen-h flex flex-col bg-page">
      {progress !== undefined ? (
        <div className="safe-top px-5 pb-3">
          <div className="flex items-center gap-3">
            <Progress value={progress} />
            {step && total ? (
              <span className="shrink-0 text-[13px] font-medium tabular-nums text-ink/40">
                {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="safe-top" />
      )}

      {/* Липкий низ перекрывает длинный контент, поэтому оставляем ему место */}
      <div
        className={[
          "relative flex flex-1 flex-col px-5",
          footer && !tight ? "pb-24" : "pb-6",
        ].join(" ")}
      >
        {children}
      </div>

      {footer ? (
        <div className="safe-bottom sticky bottom-0 z-20 px-5 pt-6 bg-gradient-to-t from-page via-page to-transparent">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

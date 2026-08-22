"use client";

import { motion } from "motion/react";
import { directions, formatUsd, targetAmount, type DirectionId } from "@/lib/config";
import { Counter, Halo } from "../Deco";
import { PillButton, Screen, Title } from "../Ui";

export function Path({
  id,
  onNext,
}: {
  id: DirectionId;
  onNext: () => void;
}) {
  const steps = directions[id].path;

  return (
    <Screen
      footer={
        <div className="pb-2">
          <PillButton onClick={onNext}>Дальше</PillButton>
        </div>
      }
    >
      <div className="relative pt-6">
        <Halo />
        <div className="relative">
          <Title>Что отделяет тебя от первой $1000?</Title>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/50">
            Направление: {directions[id].title.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="relative mt-8">
        {/* Линия, вдоль которой собирается маршрут */}
        <motion.span
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: steps.length * 0.18 + 0.4, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="absolute left-[19px] top-2 bottom-16 w-px bg-ink/12"
        />

        <div className="flex flex-col gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 * i, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-4"
            >
              <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-900 text-[13px] font-semibold text-white tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="pt-2 text-[17px] font-medium leading-snug text-ink">{s}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 * steps.length, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-2 flex gap-4"
          >
            <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-white" aria-hidden="true">
                <path
                  d="M3 8.5l3.2 3.2L13 5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </span>
            <p
              className="text-[46px] font-bold leading-none text-ink-deep"
              style={{ letterSpacing: "-0.045em" }}
            >
              <Counter value={targetAmount} prefix="$" delay={0.18 * steps.length} />
            </p>
          </motion.div>
        </div>
      </div>

      <p className="mt-8 text-[13px] leading-relaxed text-ink/40">
        Между тобой и результатом стоит последовательность действий, а не магия.
        Каждый шаг можно освоить. Ориентир суммы: {formatUsd(targetAmount)}.
      </p>
    </Screen>
  );
}

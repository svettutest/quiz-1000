"use client";

import { motion } from "motion/react";
import {
  directionOrder,
  directions,
  formatUsd,
  totalForDirection,
  type DirectionId,
} from "@/lib/config";
import { Halo } from "../Deco";
import { PillButton, Screen, Title } from "../Ui";

function plural(n: number): string {
  if (n === 1) return "проект";
  if (n >= 2 && n <= 4) return "проекта";
  return "проектов";
}

const tints: Record<DirectionId, string> = {
  automation: "var(--color-tint-lilac)",
  landing: "var(--color-tint-rose)",
  content: "var(--color-tint-mint)",
};

/** Один проект как физический жетон. Появляются по очереди. */
function Token({ price, delay }: { price: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-violet-900 text-[13px] font-semibold text-white"
    >
      ${price}
    </motion.div>
  );
}

export function AhaMath({ onNext }: { onNext: () => void }) {
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
          <Title>
            Как может выглядеть
            <br />
            твоя первая $1000
          </Title>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {directionOrder.map((id, i) => {
          const d = directions[id];
          const base = 0.2 * i;
          const total = totalForDirection(id);
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: base, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[32px] p-6"
              style={{ background: tints[id] }}
            >
              <p className="text-[12px] uppercase tracking-[0.16em] text-ink/45">
                {d.title}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {Array.from({ length: d.projectsForGoal }).map((_, k) => (
                  <Token key={k} price={d.examplePrice} delay={base + 0.25 + k * 0.12} />
                ))}
              </div>

              <p className="mt-5 text-[15px] font-medium text-ink/55">
                {d.projectsForGoal} {plural(d.projectsForGoal)} &times;{" "}
                {formatUsd(d.examplePrice)}
              </p>
              <p
                className="mt-1 text-[44px] font-bold leading-none text-ink-deep"
                style={{ letterSpacing: "-0.045em" }}
              >
                {formatUsd(total)}
              </p>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-ink/40">
        Смысл простой: первая $1000 это не толпа клиентов, а несколько
        коммерческих проектов.
      </p>
    </Screen>
  );
}

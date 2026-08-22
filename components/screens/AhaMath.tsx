"use client";

import { motion } from "motion/react";
import {
  directionOrder,
  directions,
  formatUsd,
  pluralProjects,
  projectsForTarget,
  totalForTarget,
  type DirectionId,
} from "@/lib/config";
import { Halo } from "../Deco";
import { PillButton, Screen, Title } from "../Ui";
import { DemandBoard } from "./DemandBoard";

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

export function AhaMath({
  target,
  onNext,
}: {
  target: number;
  onNext: () => void;
}) {
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
            Из чего складываются
            <br />
            твои {formatUsd(target)}
          </Title>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/55">
            Считаем по самой нижней границе вилки. Если брать дороже, проектов
            нужно меньше.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {directionOrder.map((id, i) => {
          const d = directions[id];
          const base = 0.2 * i;
          const count = projectsForTarget(id, target);
          const total = totalForTarget(id, target);
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
                {Array.from({ length: Math.min(count, 12) }).map((_, k) => (
                  <Token key={k} price={d.priceFrom} delay={base + 0.25 + k * 0.06} />
                ))}
                {count > 12 ? (
                  <span className="self-center text-[13px] font-medium text-ink/45">
                    и ещё {count - 12}
                  </span>
                ) : null}
              </div>

              <p className="mt-5 text-[15px] font-medium text-ink/55">
                {count} {pluralProjects(count)} &times; {formatUsd(d.priceFrom)}
              </p>
              <p
                className="mt-1 text-[44px] font-bold leading-none text-ink-deep"
                style={{ letterSpacing: "-0.045em" }}
              >
                {formatUsd(total)}
              </p>
              <p className="mt-3 text-[13px] leading-snug text-ink/45">
                Или один проект дороже вместо нескольких мелких.
              </p>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-ink/40">
        Смысл простой: {formatUsd(target)} это не толпа клиентов, а понятное
        количество коммерческих проектов.
      </p>

      <DemandBoard />
    </Screen>
  );
}

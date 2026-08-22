"use client";

import { motion } from "motion/react";
import {
  directions,
  formatUsd,
  type DirectionId,
} from "@/lib/config";
import { Coin, Halo } from "../Deco";
import { Screen, Title } from "../Ui";

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

/** Порядок направлений в программе задан ТЗ: контент, лендинги, автоматизации. */
const trackOrder: DirectionId[] = ["content", "landing", "automation"];

export function Tracks({
  recommended,
  onRestart,
}: {
  recommended: DirectionId;
  onRestart: () => void;
}) {
  return (
    <Screen>
      <div className="relative pt-6">
        <Halo />
        <div className="relative">
          <Title>Три направления внутри программы</Title>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {trackOrder.map((id, i) => {
          const d = directions[id];
          const mine = id === recommended;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[32px] p-6"
              style={{ background: tints[id] }}
            >
              <div className="absolute right-2 top-1">
                <Coin size={80} delay={0.12 * i + 0.15} />
              </div>

              {mine ? (
                <span className="relative inline-block rounded-full bg-violet-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  Твой маршрут
                </span>
              ) : null}

              <h2
                className={[
                  "relative text-[26px] font-semibold leading-none text-ink",
                  mine ? "mt-3" : "",
                ].join(" ")}
                style={{ letterSpacing: "-0.04em" }}
              >
                {d.title}
              </h2>

              <p className="relative mt-4 text-[12px] uppercase tracking-[0.14em] text-ink/40">
                Ученик осваивает
              </p>
              <div className="relative mt-2 flex flex-wrap gap-1.5">
                {d.curriculum.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-white/70 px-3 py-1.5 text-[13px] text-ink/65"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="relative mt-5 flex items-end gap-6">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.14em] text-ink/40">
                    Ориентир стоимости
                  </p>
                  <p
                    className="mt-1 text-[30px] font-bold leading-none text-ink-deep"
                    style={{ letterSpacing: "-0.04em" }}
                  >
                    {formatUsd(d.examplePrice)}
                    {id === "automation" ? "+" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-[0.14em] text-ink/40">
                    До первой $1000
                  </p>
                  <p
                    className="mt-1 text-[30px] font-bold leading-none text-ink-deep"
                    style={{ letterSpacing: "-0.04em" }}
                  >
                    {d.projectsForGoal} {plural(d.projectsForGoal)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 rounded-[32px] bg-violet-900 p-6 text-white">
        <p className="text-[19px] leading-snug">
          Первая $1000 с AI это не абстрактная мечта. Это конкретный навык,
          конкретная услуга, понятная стоимость, несколько коммерческих проектов
          и последовательность действий.
        </p>
      </div>

      <button
        onClick={onRestart}
        className="mt-6 mb-2 self-start text-[14px] font-medium text-ink/40 underline underline-offset-4"
      >
        Пройти заново
      </button>
    </Screen>
  );
}

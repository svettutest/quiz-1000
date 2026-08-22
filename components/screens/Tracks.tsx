"use client";

import { motion } from "motion/react";
import {
  directions,
  formatUsd,
  pluralProjects,
  projectsForTarget,
  type DirectionId,
} from "@/lib/config";
import { Coin, Halo } from "../Deco";
import { PillButton, Screen, Title } from "../Ui";

const tints: Record<DirectionId, string> = {
  automation: "var(--color-tint-lilac)",
  landing: "var(--color-tint-rose)",
  content: "var(--color-tint-mint)",
};

/** Порядок пакетов как в программе: 1, 2, 3. */
const trackOrder: DirectionId[] = ["landing", "content", "automation"];

export function Tracks({
  recommended,
  target,
  onRestart,
}: {
  recommended: DirectionId;
  target: number;
  onRestart: () => void;
}) {
  return (
    <Screen>
      <div className="relative pt-6">
        <Halo />
        <div className="relative">
          <Title>Три пакета программы</Title>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/55">
            Каждый пакет закрывает своё направление целиком: от навыка до первых
            коммерческих проектов.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {trackOrder.map((id, i) => {
          const d = directions[id];
          const pkg = d.coursePackage;
          const count = projectsForTarget(id, target);
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

              <p
                className={[
                  "relative text-[12px] uppercase tracking-[0.16em] text-ink/40",
                  mine ? "mt-4" : "",
                ].join(" ")}
              >
                Пакет {pkg.number}
              </p>
              <h2
                className="relative mt-1 text-[26px] font-semibold leading-tight text-ink"
                style={{ letterSpacing: "-0.04em" }}
              >
                {pkg.name}
              </h2>
              <p className="relative mt-1.5 text-[14px] font-medium text-violet-700">
                Направление: {d.title.toLowerCase()}
              </p>

              <p className="relative mt-5 text-[12px] uppercase tracking-[0.14em] text-ink/40">
                Модули
              </p>
              <ul className="relative mt-2.5 flex flex-col gap-2">
                {pkg.modules.map((m) => (
                  <li
                    key={m}
                    className="flex gap-2.5 text-[15px] leading-snug text-ink/75"
                  >
                    <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-700" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>

              <div className="relative mt-5 flex items-end gap-6 border-t border-ink/10 pt-4">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.14em] text-ink/40">
                    Услуга на рынке
                  </p>
                  <p
                    className="mt-1 text-[26px] font-bold leading-none text-ink-deep"
                    style={{ letterSpacing: "-0.04em" }}
                  >
                    от {formatUsd(d.priceFrom)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-[0.14em] text-ink/40">
                    До {formatUsd(target)}
                  </p>
                  <p
                    className="mt-1 text-[26px] font-bold leading-none text-ink-deep"
                    style={{ letterSpacing: "-0.04em" }}
                  >
                    {count} {pluralProjects(count)}
                  </p>
                </div>
              </div>

              {/* Цена участия и кнопка появятся, как только придёт актуальная сетка */}
              {pkg.price !== null ? (
                <div className="relative mt-5">
                  <p className="text-[12px] uppercase tracking-[0.14em] text-ink/40">
                    Стоимость пакета
                  </p>
                  <p
                    className="mt-1 text-[34px] font-bold leading-none text-ink-deep"
                    style={{ letterSpacing: "-0.045em" }}
                  >
                    {formatUsd(pkg.price)}
                  </p>
                  <div className="mt-4">
                    <PillButton
                      onClick={() => {
                        if (pkg.url) window.location.href = pkg.url;
                      }}
                    >
                      Забрать пакет {pkg.number}
                    </PillButton>
                  </div>
                </div>
              ) : null}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 rounded-[32px] bg-violet-900 p-6 text-white">
        <p className="text-[19px] leading-snug">
          {formatUsd(target)} с AI это не абстрактная мечта. Это конкретный навык,
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

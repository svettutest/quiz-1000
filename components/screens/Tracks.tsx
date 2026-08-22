"use client";

import { motion } from "motion/react";
import { directions, formatUsd, type DirectionId } from "@/lib/config";
import { Coin, Halo } from "../Deco";
import { PillButton, Screen } from "../Ui";

const tints: Record<DirectionId, string> = {
  automation: "var(--color-tint-lilac)",
  landing: "var(--color-tint-rose)",
  content: "var(--color-tint-mint)",
};

/** Порядок пакетов как в программе: 1, 2, 3. */
const trackOrder: DirectionId[] = ["landing", "content", "automation"];

/**
 * Финальный экран это витрина пакетов, а не повтор математики.
 * Человек уже увидел свою математику на экране результата, здесь он выбирает
 * и переходит на оплату.
 */
export function Tracks({
  recommended,
  onRestart,
}: {
  recommended: DirectionId;
  onRestart: () => void;
}) {
  const mineFirst = [
    recommended,
    ...trackOrder.filter((id) => id !== recommended),
  ];

  return (
    <Screen>
      <div className="relative pt-6">
        <Halo />
        <div className="relative">
          <p className="text-[12px] uppercase tracking-[0.16em] text-ink/40">
            Забрать программу
          </p>
          <h1
            className="mt-3 text-[30px] font-semibold leading-[1.05] text-ink sm:text-5xl"
            style={{ letterSpacing: "-0.04em" }}
          >
            Твой пакет и что в нём
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/55">
            Пакет под твоё направление стоит первым. Остальные два открыты, если
            захочешь взять шире.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {mineFirst.map((id, i) => {
          const d = directions[id];
          const pkg = d.coursePackage;
          const mine = id === recommended;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
              className={[
                "relative overflow-hidden rounded-[32px] p-6",
                mine ? "" : "border border-ink/12",
              ].join(" ")}
              style={mine ? { background: tints[id] } : undefined}
            >
              {mine ? (
                <div className="absolute right-2 top-1">
                  <Coin size={80} delay={0.3} />
                </div>
              ) : null}

              {mine ? (
                <span className="relative inline-block rounded-full bg-violet-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  Твой пакет
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

              <ul className="relative mt-5 flex flex-col gap-2">
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

              <div className="relative mt-6 border-t border-ink/10 pt-5">
                {pkg.price !== null ? (
                  <>
                    <p className="text-[12px] uppercase tracking-[0.14em] text-ink/40">
                      Стоимость
                    </p>
                    <p
                      className="mt-1 text-[40px] font-bold leading-none text-ink-deep"
                      style={{ letterSpacing: "-0.045em" }}
                    >
                      {formatUsd(pkg.price)}
                    </p>
                    <div className="mt-5">
                      <PillButton
                        onClick={() => {
                          if (pkg.url) window.location.href = pkg.url;
                        }}
                      >
                        Забрать пакет {pkg.number}
                      </PillButton>
                    </div>
                  </>
                ) : (
                  /* FIXME(pricing): ждём цену и ссылку оплаты от Влада */
                  <p className="text-[14px] leading-snug text-ink/40">
                    Здесь встанет цена пакета и кнопка оплаты. Ждём актуальную
                    сетку.
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={onRestart}
        className="mt-8 mb-2 self-start text-[14px] font-medium text-ink/40 underline underline-offset-4"
      >
        Пройти заново
      </button>
    </Screen>
  );
}

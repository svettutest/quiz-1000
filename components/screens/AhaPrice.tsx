"use client";

import { motion } from "motion/react";
import { directionOrder, directions, formatUsd } from "@/lib/config";
import { Coin, Counter, Halo } from "../Deco";
import { PillButton, Screen, Title } from "../Ui";

const tints: Record<string, string> = {
  automation: "var(--color-tint-lilac)",
  landing: "var(--color-tint-rose)",
  content: "var(--color-tint-mint)",
};

export function AhaPrice({ onNext }: { onNext: () => void }) {
  return (
    <Screen
      footer={
        <div className="pb-2">
          <PillButton onClick={onNext}>Показать математику</PillButton>
        </div>
      }
    >
      <div className="relative pt-6">
        <Halo />
        <div className="relative">
          <Title>
            $1000 это не обязательно
            <br />
            десятки клиентов
          </Title>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {directionOrder.map((id, i) => {
          const d = directions[id];
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[32px] p-7"
              style={{ background: tints[id] }}
            >
              <div className="absolute right-2 top-2">
                <Coin size={92} delay={0.15 * i + 0.2} />
              </div>

              <p className="relative text-[12px] uppercase tracking-[0.16em] text-ink/45">
                {d.title}
              </p>
              <p className="relative mt-6 text-[13px] text-ink/55">{d.priceCaption}</p>
              <p
                className="relative mt-1 text-[52px] font-bold leading-none text-ink-deep"
                style={{ letterSpacing: "-0.045em" }}
              >
                <Counter value={d.examplePrice} prefix="$" delay={0.15 * i + 0.25} />
              </p>
              <p className="relative mt-4 max-w-[16rem] text-[15px] leading-snug text-ink/60">
                {d.blurb}
              </p>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-ink/40">
        Это ориентиры рынка, а не обещание конкретной суммы. Цена всегда зависит
        от задачи и от того, что ты умеешь дать бизнесу. Цель для сравнения:{" "}
        {formatUsd(1000)}.
      </p>
    </Screen>
  );
}

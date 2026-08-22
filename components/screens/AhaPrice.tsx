"use client";

import { motion } from "motion/react";
import { directionOrder, directions, type DirectionId } from "@/lib/config";
import { Coin, Counter, Halo } from "../Deco";
import { PillButton, Screen, Title } from "../Ui";

const tints: Record<DirectionId, string> = {
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
          <p className="mt-4 text-[15px] leading-relaxed text-ink/55">
            Вот сколько эти услуги стоят на рынке сейчас. Это нижняя граница,
            с которой можно начинать брать заказы.
          </p>
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

              <p className="relative mt-6 text-[13px] text-ink/55">На рынке сейчас</p>

              {/* Вилка, а не фиксированная цена: потолка у этих услуг нет */}
              <p
                className="relative mt-1 flex items-baseline gap-2 text-ink-deep"
                style={{ letterSpacing: "-0.045em" }}
              >
                <span className="text-[22px] font-medium text-ink/50">от</span>
                <span className="text-[52px] font-bold leading-none">
                  <Counter value={d.priceFrom} prefix="$" delay={0.15 * i + 0.25} />
                </span>
                <span className="text-[22px] font-medium text-ink/50">
                  {d.priceNote}
                </span>
              </p>

              <p className="relative mt-4 text-[15px] leading-snug text-ink/60">
                {d.marketLine}
              </p>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-ink/40">
        Цена всегда зависит от задачи и от того, что ты умеешь дать бизнесу.
        Ниже показываем математику по самой нижней границе.
      </p>
    </Screen>
  );
}

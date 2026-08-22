"use client";

import { motion } from "motion/react";
import { Halo } from "../Deco";
import { PillButton, Screen, Title } from "../Ui";

const learn = [
  "что продавать",
  "как создавать результат с AI",
  "как контролировать качество",
  "как собрать портфолио и пример",
  "как выполнять заказ",
];

const monetize = [
  "как упаковать услугу",
  "как определить цену",
  "где искать клиентов",
  "что им предложить",
  "как начать коммуникацию",
  "как вести клиента до сделки",
];

function Half({
  eyebrow,
  items,
  dark,
  delay,
}: {
  eyebrow: string;
  items: string[];
  dark?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "rounded-[32px] p-6",
        dark ? "bg-violet-900 text-white" : "bg-white text-ink",
      ].join(" ")}
    >
      <p
        className={[
          "text-[12px] uppercase tracking-[0.16em]",
          dark ? "text-white/45" : "text-ink/40",
        ].join(" ")}
      >
        {eyebrow}
      </p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((s) => (
          <li key={s} className="flex gap-2.5 text-[16px] leading-snug">
            <span
              className={[
                "mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full",
                dark ? "bg-violet-300" : "bg-violet-700",
              ].join(" ")}
            />
            <span className={dark ? "text-white/85" : "text-ink/75"}>{s}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Program({ onNext }: { onNext: () => void }) {
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
            Именно этот путь
            <br />
            мы собрали внутри программы
          </Title>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <Half eyebrow="Научиться" items={learn} delay={0.05} />
        <Half eyebrow="Монетизировать" items={monetize} dark delay={0.2} />
      </div>

      <p className="mt-7 text-[17px] leading-relaxed text-ink/70">
        Мы не просто показываем AI-инструменты. Мы собираем путь от навыка до
        коммерческого результата.
      </p>
    </Screen>
  );
}

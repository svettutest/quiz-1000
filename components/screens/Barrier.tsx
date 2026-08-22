"use client";

import { motion } from "motion/react";
import { Halo } from "../Deco";
import { PillButton, Screen, Title } from "../Ui";

const blocks = [
  {
    name: "Лендинг",
    before: ["исследование", "копирайтер", "дизайнер", "разработчик"],
    after: "один специалист + AI-процесс",
  },
  {
    name: "Контент",
    before: ["идея", "сценарист", "дизайнер", "монтажёр"],
    after: "один специалист + AI-процесс",
  },
  {
    name: "Автоматизации",
    before: ["аналитик", "разработчик", "интегратор"],
    after: "один специалист + AI-процесс",
  },
];

export function Barrier({ onNext }: { onNext: () => void }) {
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
          <Title>AI меняет порог входа</Title>
          <p className="mt-4 text-[17px] leading-relaxed text-ink/60 max-w-md">
            Раньше для коммерческого результата чаще всего нужна была команда.
            Сейчас значительную часть работы закрывает один человек с правильным
            AI-процессом.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {blocks.map((b, i) => (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-white p-5"
          >
            <p className="text-[15px] font-semibold text-ink">{b.name}</p>

            <p className="mt-4 text-[12px] uppercase tracking-[0.14em] text-ink/35">
              Раньше
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {b.before.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-page px-3 py-1.5 text-[13px] text-ink/55"
                >
                  {s}
                </span>
              ))}
            </div>

            <p className="mt-5 text-[12px] uppercase tracking-[0.14em] text-ink/35">
              С AI
            </p>
            <div className="mt-2">
              <span className="inline-block rounded-full bg-violet-900 px-3.5 py-1.5 text-[13px] font-medium text-white">
                {b.after}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-ink/40">
        AI не заменяет специалиста целиком и не делает качество сам. Человек
        по-прежнему отвечает за задачу и результат.
      </p>
    </Screen>
  );
}

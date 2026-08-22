"use client";

import { motion } from "motion/react";
import { Halo } from "../Deco";
import { PillButton, Screen, Title } from "../Ui";

const helps = [
  "искать бизнесы",
  "выявлять потенциальные проблемы и коммерческие сигналы",
  "подбирать релевантное предложение",
  "персонализировать первое сообщение",
  "помогать вести дальнейшую переписку",
];

export function Platform({ onNext }: { onNext: () => void }) {
  return (
    <Screen
      footer={
        <div className="pb-2">
          <PillButton onClick={onNext}>Посмотреть направления</PillButton>
        </div>
      }
    >
      <div className="relative pt-6">
        <Halo />
        <div className="relative">
          <p className="text-[12px] uppercase tracking-[0.16em] text-ink/40">
            А где брать клиентов
          </p>
          <div className="mt-3">
            <Title>AI-платформа внутри курса</Title>
          </div>
          <p className="mt-4 text-[17px] leading-relaxed text-ink/60">
            После обучения мы не оставляем тебя с советом «теперь иди искать
            клиентов». У участников есть AI-платформа, которая помогает находить
            потенциально подходящие бизнесы и готовить персонализированную
            коммуникацию.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 rounded-[32px] bg-violet-900 p-6 text-white"
      >
        <p className="text-[12px] uppercase tracking-[0.16em] text-white/45">
          Что она помогает делать
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {helps.map((s, i) => (
            <motion.li
              key={s}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.09 }}
              className="flex gap-3 text-[16px] leading-snug text-white/85"
            >
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
              <span>{s}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <p className="mt-6 text-[13px] leading-relaxed text-ink/40">
        Платформа это часть инфраструктуры курса и ответ на вопрос «а где брать
        клиентов».
      </p>
    </Screen>
  );
}

"use client";

import { motion } from "motion/react";
import { formatUsd } from "@/lib/config";

/**
 * Доска запросов в формате «кто ищет прямо сейчас».
 *
 * Осознанно НЕ ставим сюда названия реальных компаний и не выдаём это
 * за живую выгрузку вакансий: ТЗ прямо запрещает показывать то, чего мы
 * не проверяли. Это типовые запросы бизнеса, тип бизнеса вместо бренда.
 */

interface Request {
  who: string;
  need: string;
  direction: string;
  budget: number;
}

const requests: Request[] = [
  {
    who: "Стоматология, локальный бизнес",
    need: "Нужна посадочная под запись на приём, сейчас заявки идут только из директа",
    direction: "AI-лендинги",
    budget: 500,
  },
  {
    who: "Онлайн-школа",
    need: "Нужен бот, который разбирает заявки и доводит до менеджера, руками не успевают",
    direction: "AI-автоматизации",
    budget: 1000,
  },
  {
    who: "Салон красоты",
    need: "Нужен пакет креативов и видео под рекламу на месяц вперёд",
    direction: "AI-контент",
    budget: 250,
  },
  {
    who: "Сервис доставки",
    need: "Нужен AI-ассистент на первую линию, чтобы снять типовые вопросы с людей",
    direction: "AI-автоматизации",
    budget: 1000,
  },
  {
    who: "Студия ремонта",
    need: "Нужна страница под запуск с квизом, чтобы считать заявки, а не звонки",
    direction: "AI-лендинги",
    budget: 500,
  },
];

export function DemandBoard() {
  return (
    <div className="mt-10">
      <p className="text-[12px] uppercase tracking-[0.16em] text-ink/40">
        Кто ищет прямо сейчас
      </p>
      <h2
        className="mt-3 text-[26px] font-semibold leading-[1.1] text-ink"
        style={{ letterSpacing: "-0.035em" }}
      >
        Запросов больше, чем людей, которые умеют их закрывать
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
        Бизнесы уже поняли, что это им нужно. Специалистов, которые умеют
        собрать результат с AI и довести его до готового, пока мало. Именно
        поэтому вход сюда сейчас дешевле, чем будет через год.
      </p>

      {/* Горизонтальная доска запросов */}
      <div
        className="rail -mx-5 mt-6 gap-3 px-5 pb-2"
        style={{ gridAutoColumns: "min(78vw, 300px)" }}
      >
        {requests.map((r, i) => (
          <motion.article
            key={r.who + r.direction}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[24px] bg-white p-5"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-600 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-600" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-ink/40">
                Открытый запрос
              </span>
            </div>

            <p className="mt-3 text-[16px] font-semibold leading-snug text-ink">
              {r.who}
            </p>
            <p className="mt-2 text-[14px] leading-snug text-ink/60">{r.need}</p>

            <div className="mt-4 flex items-center justify-between border-t border-hair pt-3">
              <span className="text-[12px] font-medium text-violet-700">
                {r.direction}
              </span>
              <span className="text-[13px] font-semibold tabular-nums text-ink">
                от {formatUsd(r.budget)}
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-ink/35">
        Это типовые запросы, с которыми бизнесы приходят. Названия не указываем
        намеренно, показываем тип бизнеса и суть задачи.
      </p>
    </div>
  );
}

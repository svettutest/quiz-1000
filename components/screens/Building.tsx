"use client";

import { motion } from "motion/react";
import { useEffect } from "react";
import { Halo } from "../Deco";
import { Screen } from "../Ui";

const lines = [
  "Смотрим твою стартовую точку",
  "Учитываем текущие навыки",
  "Учитываем интересы",
  "Учитываем доступное время",
  "Сравниваем три направления",
];

const STEP = 0.5;
const TOTAL = STEP * lines.length + 0.9;

export function Building({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, TOTAL * 1000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <Screen>
      <div className="relative flex flex-1 flex-col justify-center">
        <Halo />
        <div className="relative">
          <p className="text-[12px] uppercase tracking-[0.16em] text-ink/40">
            Собираем твой путь
          </p>

          <div className="mt-7 flex flex-col gap-4">
            {lines.map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * STEP }}
                className="flex items-center gap-3"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: i * STEP + 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-900"
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3 text-white" aria-hidden="true">
                    <path
                      d="M3 8.5l3.2 3.2L13 5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </motion.span>
                <span className="text-[17px] font-medium text-ink">{line}</span>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: lines.length * STEP }}
              className="flex items-center gap-3"
            >
              <span className="flex h-6 w-6 items-center justify-center">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="block h-4 w-4 rounded-full border-2 border-ink/15 border-t-ink/60"
                />
              </span>
              <span className="text-[17px] font-medium text-ink/50">
                Собираем твой путь
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

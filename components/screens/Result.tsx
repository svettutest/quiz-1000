"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  directions,
  formatUsd,
  planForTarget,
  pluralProjects,
  type DirectionId,
} from "@/lib/config";
import { rankLabel, verdictFor, type ScoreInput } from "@/lib/scoring";
import { Coin } from "../Deco";
import { PillButton, Screen, Title } from "../Ui";

const tints: Record<DirectionId, string> = {
  automation: "var(--color-tint-lilac)",
  landing: "var(--color-tint-rose)",
  content: "var(--color-tint-mint)",
};

/**
 * Карточка выбранного маршрута в витрине: коротко и по делу.
 * Подробности вынесены под витрину, иначе она становится высотой в экран
 * и при свайпе на короткие карточки видно пустоту.
 */
function WinnerCard({
  id,
  input,
  target,
  active,
}: {
  id: DirectionId;
  input: ScoreInput;
  target: number;
  active: boolean;
}) {
  const d = directions[id];
  const plan = planForTarget(id, target);
  const { pros } = verdictFor(id, 0, input, d.title);

  return (
    <motion.article
      animate={{
        opacity: active ? 1 : 0.44,
        scale: active ? 1 : 0.93,
        y: active ? 0 : 10,
      }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[32px] p-6"
      style={{ background: tints[id] }}
    >
      <div className="absolute right-2 top-1">
        <Coin size={80} delay={0.1} />
      </div>

      <p className="relative text-[12px] uppercase tracking-[0.16em] text-ink/45">
        {rankLabel(0)}
      </p>

      <h2
        className="relative mt-3 text-[28px] font-semibold leading-none text-ink"
        style={{ letterSpacing: "-0.04em" }}
      >
        {d.title}
      </h2>

      <div className="relative mt-5 rounded-2xl bg-white/70 p-4">
        <p className="text-[14px] font-medium text-ink/55">
          {plan.count} {pluralProjects(plan.count)} &times;{" "}
          {formatUsd(plan.tier.price)}
        </p>
        <p
          className="mt-0.5 text-[32px] font-bold leading-none text-ink-deep"
          style={{ letterSpacing: "-0.045em" }}
        >
          {formatUsd(plan.total)}
        </p>
        <p className="mt-2 text-[13px] leading-snug text-ink/50">
          Один такой проект это {plan.tier.label}.
        </p>
      </div>

      <p className="relative mt-5 text-[12px] uppercase tracking-[0.14em] text-ink/40">
        Почему именно это
      </p>
      <ul className="relative mt-2.5 flex flex-col gap-2">
        {pros.slice(0, 3).map((r) => (
          <li key={r} className="flex gap-2.5 text-[14px] leading-snug text-ink/70">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-700" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

/** Отклонённый маршрут. Коротко и честно: почему не сейчас. */
function RejectedCard({
  id,
  rank,
  input,
  winnerTitle,
  active,
}: {
  id: DirectionId;
  rank: number;
  input: ScoreInput;
  winnerTitle: string;
  active: boolean;
}) {
  const d = directions[id];
  const { cons, later } = verdictFor(id, rank, input, winnerTitle);

  return (
    <motion.article
      animate={{
        opacity: active ? 1 : 0.44,
        scale: active ? 1 : 0.93,
        y: active ? 0 : 10,
      }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[32px] border border-ink/12 p-6"
    >
      <p className="text-[12px] uppercase tracking-[0.16em] text-ink/35">
        {rankLabel(rank)}
      </p>

      <h2
        className="mt-3 text-[28px] font-semibold leading-none text-ink/45"
        style={{ letterSpacing: "-0.04em" }}
      >
        {d.title}
      </h2>

      <p className="mt-5 text-[12px] uppercase tracking-[0.14em] text-ink/35">
        Почему не сейчас
      </p>
      <ul className="mt-2.5 flex flex-col gap-2">
        {cons.map((c) => (
          <li key={c} className="flex gap-2.5 text-[14px] leading-snug text-ink/55">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/20" />
            <span>{c}</span>
          </li>
        ))}
      </ul>

      {later ? (
        <p className="mt-5 rounded-2xl bg-white px-4 py-3 text-[13px] leading-snug text-ink/55">
          {later}
        </p>
      ) : null}
    </motion.article>
  );
}

export function Result({
  ranked,
  input,
  target,
  onNext,
}: {
  ranked: DirectionId[];
  input: ScoreInput;
  target: number;
  onNext: () => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const winnerId = ranked[0];
  const winner = directions[winnerId];
  const pkg = winner.coursePackage;

  /** Активна та карточка, что ближе всех к центру экрана. */
  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const center = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(rail.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const mid = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    sync();
    return () => {
      rail.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [sync]);

  const goTo = (i: number) => {
    const rail = railRef.current;
    const el = rail?.children[i] as HTMLElement | undefined;
    if (!rail || !el) return;
    rail.scrollTo({
      left: el.offsetLeft - (rail.clientWidth - el.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <Screen
      footer={
        <div className="pb-2">
          <PillButton onClick={onNext}>
            Что отделяет меня от {formatUsd(target)}
          </PillButton>
        </div>
      }
    >
      <div className="pt-6">
        <p className="text-[12px] uppercase tracking-[0.16em] text-ink/40">
          По твоим ответам подходит одно
        </p>
        <div className="mt-3">
          <Title>{winner.title}</Title>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-ink/50">
          Два других направления мы тоже сравнили. Начинать с них тебе сейчас
          не стоит, листай и увидишь почему.
        </p>
      </div>

      {/* Витрина: выбранный маршрут по центру, отклонённые притушены */}
      <div
        ref={railRef}
        className="rail -mx-5 mt-6 gap-4 px-[max(20px,calc((100vw-320px)/2))] pb-2"
        style={{ gridAutoColumns: "min(82vw, 340px)" }}
      >
        {ranked.map((id, i) =>
          i === 0 ? (
            <WinnerCard
              key={id}
              id={id}
              input={input}
              target={target}
              active={active === 0}
            />
          ) : (
            <RejectedCard
              key={id}
              id={id}
              rank={i}
              input={input}
              winnerTitle={winner.title}
              active={active === i}
            />
          ),
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {ranked.map((id, i) => (
          <button
            key={id}
            onClick={() => goTo(i)}
            aria-label={`Маршрут ${i + 1}`}
            className="py-2"
          >
            <motion.span
              className="block h-1 rounded-full bg-ink"
              animate={{
                width: active === i ? 44 : 18,
                opacity: active === i ? 1 : 0.2,
              }}
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
        <span className="ml-2 text-[13px] font-semibold tabular-nums text-ink/35">
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(ranked.length).padStart(2, "0")}
        </span>
      </div>

      {/* Подробности только по выбранному маршруту */}
      <div className="mt-10">
        <p className="text-[12px] uppercase tracking-[0.16em] text-ink/40">
          Разбор твоего маршрута
        </p>

        <p className="mt-5 text-[12px] uppercase tracking-[0.14em] text-ink/40">
          Что ты будешь создавать
        </p>
        <p className="mt-2 text-[17px] leading-snug text-ink/80">
          {winner.deliverable}
        </p>

        <p className="mt-6 text-[12px] uppercase tracking-[0.14em] text-ink/40">
          Как выглядит AI-процесс
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {winner.process.map((s) => (
            <span
              key={s}
              className="rounded-full bg-white px-3 py-1.5 text-[13px] text-ink/65"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Чему учиться, взято из реальной программы Академии */}
        <div className="mt-6 rounded-[28px] bg-violet-900 p-6 text-white">
          <p className="text-[12px] uppercase tracking-[0.14em] text-white/45">
            Чему учишься
          </p>
          <p className="mt-2 text-[20px] font-semibold leading-snug">
            Пакет {pkg.number}. {pkg.name}
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {pkg.modules.map((m) => (
              <li
                key={m}
                className="flex gap-2.5 text-[15px] leading-snug text-white/80"
              >
                <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Screen>
  );
}

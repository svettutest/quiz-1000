"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { directionOrder, directions, type DirectionId } from "@/lib/config";
import {
  aiLevelQuestion,
  directionQuestion,
  emptyProfile,
  firstCommitmentQuestion,
  moneyQuestion,
  secondCommitmentQuestion,
  skillsQuestion,
  timeQuestion,
  type AiLevel,
  type MoneyExperience,
  type PreferredDirection,
  type QuizProfile,
  type SkillId,
  type TimeId,
} from "@/lib/quiz";
import { rankDirections, scoreDirections, type ScoreInput } from "@/lib/scoring";
import { submitProfile } from "@/lib/submit";
import { bindBackButton, haptic, initTelegram } from "@/lib/telegram";
import { CoinStack, Halo } from "./Deco";
import { ArrowRight, Lead, OptionCard, PillButton, Screen, Title } from "./Ui";
import { AhaMath } from "./screens/AhaMath";
import { AhaPrice } from "./screens/AhaPrice";
import { Barrier } from "./screens/Barrier";
import { Building } from "./screens/Building";
import { Path } from "./screens/Path";
import { Platform } from "./screens/Platform";
import { Program } from "./screens/Program";
import { Result } from "./screens/Result";
import { Tracks } from "./screens/Tracks";

type Step =
  | "intro"
  | "ai"
  | "money"
  | "skills"
  | "barrier"
  | "commit1"
  | "direction"
  | "time"
  | "ahaPrice"
  | "ahaMath"
  | "commit2"
  | "building"
  | "result"
  | "path"
  | "program"
  | "platform"
  | "tracks";

const flow: Step[] = [
  "intro",
  "ai",
  "money",
  "skills",
  "barrier",
  "commit1",
  "direction",
  "time",
  "ahaPrice",
  "ahaMath",
  "commit2",
  "building",
  "result",
  "path",
  "program",
  "platform",
  "tracks",
];

/** Прогресс считаем только по вопросам, информационные экраны его не двигают. */
const questionSteps: Step[] = [
  "ai",
  "money",
  "skills",
  "commit1",
  "direction",
  "time",
  "commit2",
];

interface ProgressProps {
  progressValue: number;
  step: number;
  total: number;
}

/** Один и тот же цвет закреплён за направлением на всех экранах. */
const directionTints: Record<DirectionId, string> = {
  automation: "var(--color-tint-lilac)",
  landing: "var(--color-tint-rose)",
  content: "var(--color-tint-mint)",
};

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
};

export function Quiz() {
  const [step, setStep] = useState<Step>("intro");
  const [aiLevel, setAiLevel] = useState<AiLevel | null>(null);
  const [money, setMoney] = useState<MoneyExperience | null>(null);
  const [skills, setSkills] = useState<SkillId[]>([]);
  const [preferred, setPreferred] = useState<PreferredDirection | null>(null);
  const [time, setTime] = useState<TimeId | null>(null);
  const [commit1, setCommit1] = useState<string | null>(null);
  const [commit2, setCommit2] = useState<string | null>(null);

  const index = flow.indexOf(step);

  const go = useCallback((target: Step) => {
    setStep(target);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const next = useCallback(() => {
    const i = flow.indexOf(step);
    if (i < flow.length - 1) go(flow[i + 1]);
  }, [step, go]);

  const back = useCallback(() => {
    const i = flow.indexOf(step);
    if (i > 0) go(flow[i - 1]);
  }, [step, go]);

  useEffect(() => {
    initTelegram();
  }, []);

  useEffect(() => {
    if (step === "intro") return bindBackButton(null);
    return bindBackButton(back);
  }, [step, back]);

  const input: ScoreInput = useMemo(
    () => ({
      aiLevel,
      monetizationExperience: money,
      skills,
      preferredDirection: preferred,
      availableTime: time,
    }),
    [aiLevel, money, skills, preferred, time],
  );

  const scores = useMemo(() => scoreDirections(input), [input]);
  const ranked = useMemo(() => rankDirections(scores), [scores]);
  const recommended: DirectionId = ranked[0];

  /** Профиль складываем, когда путь собран. */
  useEffect(() => {
    if (step !== "result") return;
    const profile: QuizProfile = {
      ...emptyProfile,
      aiLevel,
      monetizationExperience: money,
      skills,
      preferredDirection: preferred,
      availableTime: time,
      firstCommitment: commit1,
      secondCommitment: commit2,
      scores,
      recommendedDirection: recommended,
    };
    void submitProfile(profile);
  }, [
    step,
    aiLevel,
    money,
    skills,
    preferred,
    time,
    commit1,
    commit2,
    scores,
    recommended,
  ]);

  const progress: ProgressProps = useMemo(() => {
    const done = questionSteps.filter((s) => flow.indexOf(s) < index).length;
    const current = questionSteps.includes(step) ? done + 1 : done;
    return {
      progressValue: current / questionSteps.length,
      step: Math.max(1, current),
      total: questionSteps.length,
    };
  }, [index, step]);

  /** Одиночный выбор сам ведёт дальше, чтобы держать ритм. */
  function pick<T>(set: (v: T) => void) {
    return (value: T) => {
      haptic("select");
      set(value);
      setTimeout(next, 380);
    };
  }

  const toggleSkill = (value: SkillId) => {
    haptic("select");
    setSkills((prev) => {
      if (value === "none") return prev.includes("none") ? [] : ["none"];
      const without = prev.filter((s) => s !== "none");
      return without.includes(value)
        ? without.filter((s) => s !== value)
        : [...without, value];
    });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={step} {...fade}>
        {step === "intro" ? <Intro onStart={next} /> : null}

        {step === "ai" ? (
          <Question
            {...progress}
            onBack={back}
            title={aiLevelQuestion.title}
            options={aiLevelQuestion.options}
            selected={aiLevel}
            onPick={pick(setAiLevel)}
          />
        ) : null}

        {step === "money" ? (
          <Question
            {...progress}
            onBack={back}
            title={moneyQuestion.title}
            options={moneyQuestion.options}
            selected={money}
            onPick={pick(setMoney)}
          />
        ) : null}

        {step === "skills" ? (
          <SkillsScreen
            {...progress}
            onBack={back}
            selected={skills}
            onToggle={toggleSkill}
            onNext={next}
          />
        ) : null}

        {step === "barrier" ? <Barrier onNext={next} /> : null}

        {step === "commit1" ? (
          <Question
            {...progress}
            onBack={back}
            title={firstCommitmentQuestion.title}
            options={firstCommitmentQuestion.options}
            selected={commit1 as "yes" | "show" | null}
            onPick={pick(setCommit1)}
          />
        ) : null}

        {step === "direction" ? (
          <DirectionScreen
            {...progress}
            onBack={back}
            selected={preferred}
            onPick={pick(setPreferred)}
          />
        ) : null}

        {step === "time" ? (
          <Question
            {...progress}
            onBack={back}
            title={timeQuestion.title}
            options={timeQuestion.options}
            selected={time}
            onPick={pick(setTime)}
          />
        ) : null}

        {step === "ahaPrice" ? <AhaPrice onNext={next} /> : null}
        {step === "ahaMath" ? <AhaMath onNext={next} /> : null}

        {step === "commit2" ? (
          <Question
            {...progress}
            onBack={back}
            title={secondCommitmentQuestion.title}
            options={secondCommitmentQuestion.options}
            selected={commit2 as "yes" | "unsure" | null}
            onPick={pick(setCommit2)}
          />
        ) : null}

        {step === "building" ? <Building onDone={next} /> : null}

        {step === "result" ? (
          <Result ranked={ranked} input={input} onNext={next} />
        ) : null}

        {step === "path" ? <Path id={recommended} onNext={next} /> : null}
        {step === "program" ? <Program onNext={next} /> : null}
        {step === "platform" ? <Platform onNext={next} /> : null}

        {step === "tracks" ? (
          <Tracks recommended={recommended} onRestart={() => go("intro")} />
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      aria-label="Назад"
      className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink/60"
    >
      <ArrowRight className="h-4 w-4 rotate-180" />
    </button>
  );
}

function QuestionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="text-[26px] font-semibold leading-[1.15] text-ink"
      style={{ letterSpacing: "-0.03em" }}
    >
      {children}
    </h1>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <Screen
      tight
      footer={
        <div className="pb-2">
          <PillButton onClick={onStart}>Показать мой путь</PillButton>
        </div>
      }
    >
      <div className="relative flex flex-1 flex-col justify-end pb-4 pt-10">
        <Halo />
        <div className="relative">
          <div className="mb-9 -ml-3">
            <CoinStack />
          </div>

          <Title size="xl">
            Твой путь
            <br />к первой $1000
            <br />с AI
          </Title>

          <div className="mt-5">
            <Lead>
              Узнай, какой AI-навык тебе проще всего превратить в услугу и как
              может выглядеть твой путь к первой $1000.
            </Lead>
          </div>

          <p className="mt-6 text-[13px] text-ink/35">2 минуты, 7 вопросов</p>
        </div>
      </div>
    </Screen>
  );
}

interface QuestionProps<T extends string> extends ProgressProps {
  title: string;
  options: { value: T; label: string }[];
  selected: T | null;
  onPick: (v: T) => void;
  onBack: () => void;
}

function Question<T extends string>({
  title,
  options,
  selected,
  onPick,
  onBack,
  progressValue,
  step,
  total,
}: QuestionProps<T>) {
  return (
    <Screen tight progress={progressValue} step={step} total={total}>
      <div className="pt-2">
        <BackButton onBack={onBack} />
      </div>

      {/* Вопрос стоит по центру экрана, а не прижат к шапке */}
      <div className="flex flex-1 flex-col justify-center pb-10">
        <QuestionTitle>{title}</QuestionTitle>

        <div className="mt-7 flex flex-col gap-2.5">
          {options.map((o, i) => (
            <motion.div
              key={o.value}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i }}
            >
              <OptionCard
                label={o.label}
                selected={selected === o.value}
                onClick={() => onPick(o.value)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

interface SkillsProps extends ProgressProps {
  selected: SkillId[];
  onToggle: (v: SkillId) => void;
  onNext: () => void;
  onBack: () => void;
}

function SkillsScreen({
  selected,
  onToggle,
  onNext,
  onBack,
  progressValue,
  step,
  total,
}: SkillsProps) {
  const showReaction = selected.includes("none");
  return (
    <Screen
      progress={progressValue}
      step={step}
      total={total}
      footer={
        <div className="pb-2">
          <PillButton onClick={onNext} disabled={selected.length === 0}>
            Дальше
          </PillButton>
        </div>
      }
    >
      <div className="pt-2">
        <BackButton onBack={onBack} />
        <QuestionTitle>{skillsQuestion.title}</QuestionTitle>
        <p className="mt-2 text-[14px] text-ink/40">{skillsQuestion.hint}</p>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        {skillsQuestion.options.map((o, i) => (
          <motion.div
            key={o.value}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.03 * i }}
          >
            <OptionCard
              label={o.label}
              multi
              selected={selected.includes(o.value)}
              onClick={() => onToggle(o.value)}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showReaction ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 overflow-hidden rounded-2xl bg-violet-100 px-5 py-4 text-[15px] leading-snug text-violet-700"
          >
            {skillsQuestion.emptyReaction}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </Screen>
  );
}

interface DirectionProps extends ProgressProps {
  selected: PreferredDirection | null;
  onPick: (v: PreferredDirection) => void;
  onBack: () => void;
}

function DirectionScreen({
  selected,
  onPick,
  onBack,
  progressValue,
  step,
  total,
}: DirectionProps) {
  return (
    <Screen progress={progressValue} step={step} total={total}>
      <div className="pt-2">
        <BackButton onBack={onBack} />
        <QuestionTitle>{directionQuestion.title}</QuestionTitle>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {directionOrder.map((id, i) => {
          const d = directions[id];
          const active = selected === id;
          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.06 * i }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onPick(id)}
              style={active ? undefined : { background: directionTints[id] }}
              className={[
                "rounded-[28px] p-5 text-left transition-colors duration-200",
                active ? "bg-violet-900 text-white" : "text-ink",
              ].join(" ")}
            >
              <p
                className={[
                  "text-[12px] uppercase tracking-[0.16em]",
                  active ? "text-white/45" : "text-ink/40",
                ].join(" ")}
              >
                Направление
              </p>
              <p
                className="mt-2 text-[22px] font-semibold leading-none"
                style={{ letterSpacing: "-0.03em" }}
              >
                {d.title}
              </p>
              <p
                className={[
                  "mt-2.5 text-[15px] leading-snug",
                  active ? "text-white/70" : "text-ink/55",
                ].join(" ")}
              >
                {d.blurb}
              </p>
            </motion.button>
          );
        })}

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.24 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => onPick("unknown")}
          className={[
            "rounded-[28px] border p-5 text-left transition-colors duration-200",
            selected === "unknown"
              ? "border-violet-900 bg-violet-900 text-white"
              : "border-ink/12 bg-transparent text-ink",
          ].join(" ")}
        >
          <p
            className="text-[22px] font-semibold leading-none"
            style={{ letterSpacing: "-0.03em" }}
          >
            {directionQuestion.unknownLabel}
          </p>
          <p
            className={[
              "mt-2.5 text-[15px] leading-snug",
              selected === "unknown" ? "text-white/70" : "text-ink/55",
            ].join(" ")}
          >
            {directionQuestion.unknownBlurb}
          </p>
        </motion.button>
      </div>
    </Screen>
  );
}

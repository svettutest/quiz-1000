import type { DirectionId } from "./config";

/** Тексты вопросов и вариантов взяты из ТЗ без изменений. */

export type AiLevel = "none" | "chatgpt" | "tools" | "work";
export type MoneyExperience = "paid" | "unstable" | "want" | "unclear";
export type SkillId =
  | "sites"
  | "design"
  | "content"
  | "video"
  | "marketing"
  | "sales"
  | "code"
  | "automation"
  | "ai"
  | "none";
export type TimeId = "week" | "hour" | "few" | "full";
export type GoalId = "1000" | "3000" | "5000" | "10000";
export type PreferredDirection = DirectionId | "unknown";

export interface Option<T extends string> {
  value: T;
  label: string;
}

export const aiLevelQuestion = {
  title: "Как ты сейчас используешь AI?",
  options: [
    { value: "none", label: "Пока практически никак" },
    { value: "chatgpt", label: "Иногда пользуюсь ChatGPT" },
    { value: "tools", label: "Уже пробую разные AI-инструменты" },
    { value: "work", label: "Использую AI в работе" },
  ] as Option<AiLevel>[],
};

export const moneyQuestion = {
  title: "Ты уже пробовал зарабатывать с помощью AI?",
  options: [
    { value: "paid", label: "Да, уже получал деньги за AI-работу" },
    { value: "unstable", label: "Пробовал, но пока нестабильно" },
    { value: "want", label: "Нет, но хочу" },
    { value: "unclear", label: "Пока вообще не понимаю, на чём здесь зарабатывать" },
  ] as Option<MoneyExperience>[],
};

export const skillsQuestion = {
  title: "Что ты уже умеешь?",
  hint: "Можно выбрать несколько",
  options: [
    { value: "sites", label: "Сайты" },
    { value: "design", label: "Дизайн" },
    { value: "content", label: "Контент / SMM" },
    { value: "video", label: "Видео" },
    { value: "marketing", label: "Маркетинг" },
    { value: "sales", label: "Продажи" },
    { value: "code", label: "Код / разработка" },
    { value: "automation", label: "Автоматизации" },
    { value: "ai", label: "Уверенно работаю с AI" },
    { value: "none", label: "Пока ничего из этого" },
  ] as Option<SkillId>[],
  /** Реакция на «Пока ничего из этого» */
  emptyReaction: "Тогда будем смотреть направления с минимальным порогом входа.",
};

export const firstCommitmentQuestion = {
  title:
    "Если тебе дадут готовый процесс по шагам, ты бы попробовал освоить одну такую услугу?",
  options: [
    { value: "yes", label: "Да" },
    { value: "show", label: "Сначала хочу увидеть варианты" },
  ] as Option<"yes" | "show">[],
};

export const directionQuestion = {
  title: "Что из этого тебе было бы интереснее научиться создавать?",
  unknownLabel: "Пока не знаю",
  unknownBlurb: "Система сама ранжирует варианты на основе предыдущих ответов.",
};

export const timeQuestion = {
  title: "Сколько времени ты реально можешь уделять этому на старте?",
  options: [
    { value: "week", label: "Несколько часов в неделю" },
    { value: "hour", label: "Около часа в день" },
    { value: "few", label: "2-3 часа в день" },
    { value: "full", label: "Готов заниматься этим полноценно" },
  ] as Option<TimeId>[],
};

/**
 * Цель человека. Вся математика дальше считается от неё, а не от фиксированной
 * тысячи: «до твоей цели нужно столько-то заказов».
 */
export const goalQuestion = {
  title: "Сколько ты хочешь выйти зарабатывать в месяц?",
  hint: "От этого посчитаем, сколько проектов тебе нужно",
  options: [
    { value: "1000", label: "$1,000, первая цель" },
    { value: "3000", label: "$3,000" },
    { value: "5000", label: "$5,000" },
    { value: "10000", label: "$10,000 и больше" },
  ] as Option<GoalId>[],
};

/** Число из ответа. Держим отдельно, чтобы не парсить строку по всему коду. */
export const goalAmount: Record<GoalId, number> = {
  "1000": 1000,
  "3000": 3000,
  "5000": 5000,
  "10000": 10000,
};

export const secondCommitmentQuestion = {
  title:
    "Если бы ты умел выполнять одну из этих услуг и понимал, где искать клиентов, ты бы попробовал на этом заработать?",
  options: [
    { value: "yes", label: "Да, хочу попробовать" },
    { value: "unsure", label: "Да, но пока не понимаю, с чего начать" },
  ] as Option<"yes" | "unsure">[],
};

/** То, что уходит дальше в CRM или в аккаунт ученика. */
export interface QuizProfile {
  aiLevel: AiLevel | null;
  monetizationExperience: MoneyExperience | null;
  skills: SkillId[];
  preferredDirection: PreferredDirection | null;
  availableTime: TimeId | null;
  goal: GoalId | null;
  firstCommitment: string | null;
  secondCommitment: string | null;
  scores: Record<DirectionId, number>;
  recommendedDirection: DirectionId;
}

export const emptyProfile: QuizProfile = {
  aiLevel: null,
  monetizationExperience: null,
  skills: [],
  preferredDirection: null,
  availableTime: null,
  goal: null,
  firstCommitment: null,
  secondCommitment: null,
  scores: { automation: 0, landing: 0, content: 0 },
  recommendedDirection: "content",
};

import { directionOrder, type DirectionId } from "./config";
import type {
  AiLevel,
  MoneyExperience,
  QuizProfile,
  SkillId,
  TimeId,
} from "./quiz";

/**
 * Простое rule-based ранжирование. Все веса собраны здесь,
 * позже их можно заменить или дополнить моделью.
 */
export const weights = {
  /** Совпадение навыка с направлением */
  skillMatch: 3,
  /** Человек сам выбрал это направление */
  interestMatch: 5,
  /** Уровень AI подходит направлению */
  aiLevelMatch: 2,
  /** Доступное время подходит направлению */
  timeMatch: 2,
  /** Базовый вес: чем ниже порог входа, тем выше старт */
  entryBarrier: { content: 2, landing: 1, automation: 0 } as Record<DirectionId, number>,
  /** Небольшой плюс тем, кто уже получал деньги, к более дорогим направлениям */
  experienceBonus: 1,
};

const skillMap: Record<DirectionId, SkillId[]> = {
  content: ["design", "content", "video"],
  landing: ["design", "sites", "marketing"],
  automation: ["code", "automation"],
};

/** Уровень AI, который направление считает своим */
const aiLevelMap: Record<DirectionId, AiLevel[]> = {
  content: ["none", "chatgpt"],
  landing: ["chatgpt", "tools"],
  automation: ["tools", "work"],
};

/** Сколько времени направление считает комфортным */
const timeMap: Record<DirectionId, TimeId[]> = {
  content: ["week", "hour"],
  landing: ["hour", "few", "full"],
  automation: ["few", "full"],
};

export interface ScoreInput {
  aiLevel: AiLevel | null;
  monetizationExperience: MoneyExperience | null;
  skills: SkillId[];
  preferredDirection: QuizProfile["preferredDirection"];
  availableTime: TimeId | null;
}

export function scoreDirections(input: ScoreInput): Record<DirectionId, number> {
  const scores = { automation: 0, landing: 0, content: 0 } as Record<DirectionId, number>;

  for (const id of directionOrder) {
    let score = weights.entryBarrier[id];

    const matched = input.skills.filter((s) => skillMap[id].includes(s));
    score += matched.length * weights.skillMatch;

    if (input.preferredDirection === id) score += weights.interestMatch;

    if (input.aiLevel && aiLevelMap[id].includes(input.aiLevel)) {
      score += weights.aiLevelMatch;
    }

    if (input.availableTime && timeMap[id].includes(input.availableTime)) {
      score += weights.timeMatch;
    }

    if (input.monetizationExperience === "paid" && id !== "content") {
      score += weights.experienceBonus;
    }

    scores[id] = score;
  }

  return scores;
}

/** Направления по убыванию, ничьи разруливаются порогом входа */
export function rankDirections(scores: Record<DirectionId, number>): DirectionId[] {
  return [...directionOrder].sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;
    return weights.entryBarrier[b] - weights.entryBarrier[a];
  });
}

const rankLabels = [
  "Лучше всего подходит для старта",
  "Хорошая альтернатива",
  "Можно рассмотреть позже",
];

export function rankLabel(index: number): string {
  return rankLabels[index] ?? rankLabels[rankLabels.length - 1];
}

const skillNames: Partial<Record<SkillId, string>> = {
  sites: "сайтах",
  design: "дизайне",
  content: "контенте",
  video: "видео",
  marketing: "маркетинге",
  sales: "продажах",
  code: "коде",
  automation: "автоматизациях",
};

const startPoint: Record<AiLevel, string> = {
  none: "подходит под твою стартовую точку, начинать можно с нуля",
  chatgpt: "подходит под твою стартовую точку, база в AI у тебя уже есть",
  tools: "подходит под твою стартовую точку, ты уже пробуешь разные инструменты",
  work: "подходит под твою стартовую точку, ты уже работаешь с AI",
};

const timeReason: Record<TimeId, string> = {
  week: "соответствует времени, которое ты готов уделять, несколько часов в неделю",
  hour: "соответствует времени, которое ты готов уделять, около часа в день",
  few: "соответствует времени, которое ты готов уделять, 2-3 часа в день",
  full: "соответствует времени, которое ты готов уделять, ты готов заниматься полноценно",
};

/**
 * Причины собираются из реальных ответов по шаблонам из ТЗ.
 * Ничего, кроме этих формулировок, не показываем.
 */
export function reasonsFor(id: DirectionId, input: ScoreInput): string[] {
  const reasons: string[] = [];

  if (input.aiLevel) reasons.push(startPoint[input.aiLevel]);

  const matched = input.skills.filter((s) => skillMap[id].includes(s));
  if (matched.length > 0) {
    const names = matched.map((s) => skillNames[s]).filter(Boolean);
    if (names.length > 0) {
      reasons.push("у тебя уже есть опыт в " + names.join(" и "));
    }
  }

  if (input.preferredDirection === id) {
    reasons.push("ты сам выбрал это направление как интересное");
  }

  if (input.availableTime) reasons.push(timeReason[input.availableTime]);

  reasons.push("значительную часть процесса можно выполнять с AI");

  return reasons;
}

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
  "Твой маршрут",
  "Второй вариант",
  "Третий вариант",
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

/**
 * Аргументы за направление. Осознанно разные у трёх направлений:
 * если писать всем одно и то же, квиз выглядит так, будто он ничего не выбрал.
 */
const ownStrength: Record<DirectionId, string> = {
  content:
    "самый низкий порог входа из трёх, первый пример можно собрать за вечер",
  landing:
    "законченный продукт, за который бизнес платит сразу и целиком",
  automation:
    "самый дорогой чек из трёх, одна работа закрывает большую часть цели",
};

/** Как уровень AI играет именно на это направление. */
const levelFit: Record<DirectionId, Partial<Record<AiLevel, string>>> = {
  content: {
    none: "здесь твой старт с нуля не мешает, инструменты простые",
    chatgpt: "того, что ты уже умеешь в ChatGPT, для старта достаточно",
  },
  landing: {
    chatgpt: "твоего уровня AI хватает, чтобы собрать страницу целиком",
    tools: "ты уже пробуешь разные инструменты, это ровно то, что нужно здесь",
  },
  automation: {
    tools: "ты уже работаешь с разными инструментами, здесь это главный актив",
    work: "ты используешь AI в работе, значит процессы видишь изнутри",
  },
};

/** Как доступное время играет именно на это направление. */
const timeFit: Record<DirectionId, Partial<Record<TimeId, string>>> = {
  content: {
    week: "укладывается в несколько часов в неделю",
    hour: "спокойно делается по часу в день",
  },
  landing: {
    hour: "один проект это несколько вечеров",
    few: "при 2-3 часах в день проект собирается за пару дней",
    full: "на полном погружении можно вести несколько проектов сразу",
  },
  automation: {
    few: "на разбор процесса клиента нужно время, у тебя оно есть",
    full: "полное погружение здесь окупается быстрее всего",
  },
};

/** Почему это направление не стоит брать первым. */
const blockers: Record<DirectionId, Partial<Record<AiLevel, string>>> = {
  automation: {
    none: "нужен уверенный уровень AI и понимание бизнес-процессов, с нуля это долго",
    chatgpt: "одного ChatGPT здесь мало, нужны интеграции и разбор процессов",
  },
  landing: {
    none: "нужен хотя бы базовый вкус и насмотренность, иначе первый сайт будет стоить дёшево",
  },
  content: {},
};

const timeBlockers: Record<DirectionId, Partial<Record<TimeId, string>>> = {
  automation: {
    week: "клиент по автоматизации требует плотного контакта, нескольких часов в неделю не хватит",
    hour: "разбор процесса не помещается в час в день",
  },
  landing: {
    week: "проект придётся тянуть неделями, клиент устанет ждать",
  },
  content: {},
};

export interface Verdict {
  /** Аргументы за. Заполняются только у выбранного маршрута */
  pros: string[];
  /** Почему не сейчас. Заполняются у отклонённых */
  cons: string[];
  /** Когда к этому вернуться */
  later: string | null;
}

/**
 * Первый маршрут получает аргументы за, остальные два честно объясняют,
 * почему начинать с них сейчас не стоит. Так квиз даёт один ответ, а не три.
 */
export function verdictFor(
  id: DirectionId,
  rank: number,
  input: ScoreInput,
  winnerTitle: string,
): Verdict {
  const matched = input.skills.filter((s) => skillMap[id].includes(s));
  const names = matched.map((s) => skillNames[s]).filter(Boolean) as string[];

  if (rank === 0) {
    const pros: string[] = [];

    if (names.length > 0) {
      pros.push("у тебя уже есть опыт в " + names.join(" и ") + ", он здесь идёт в дело");
    }
    if (input.preferredDirection === id) {
      pros.push("ты сам выбрал это направление как интересное");
    }
    if (input.aiLevel && levelFit[id][input.aiLevel]) {
      pros.push(levelFit[id][input.aiLevel] as string);
    }
    if (input.availableTime && timeFit[id][input.availableTime]) {
      pros.push(timeFit[id][input.availableTime] as string);
    }
    pros.push(ownStrength[id]);

    return { pros, cons: [], later: null };
  }

  const cons: string[] = [];

  if (input.aiLevel && blockers[id][input.aiLevel]) {
    cons.push(blockers[id][input.aiLevel] as string);
  }
  if (input.availableTime && timeBlockers[id][input.availableTime]) {
    cons.push(timeBlockers[id][input.availableTime] as string);
  }
  if (names.length === 0) {
    cons.push("опыта, который сюда ложится, у тебя пока нет");
  }
  if (cons.length === 0) {
    cons.push(
      rank === 1
        ? "направление рабочее, но стартовать сразу в двух это потерять оба"
        : "порог входа выше, чем у твоего первого маршрута",
    );
  }

  return {
    pros: [],
    cons,
    later: "Вернуться сюда, когда закроешь первые проекты по направлению " + winnerTitle,
  };
}

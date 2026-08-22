import type { QuizProfile } from "./quiz";

/**
 * Точка выгрузки профиля. Пока эндпоинта нет, поэтому профиль
 * просто складывается в localStorage, чтобы не терять ответы.
 * Когда появится приёмник, сюда подставляется URL и всё уезжает как есть.
 */
export const RESULT_ENDPOINT: string | null = null; // FIXME(integration)

const STORAGE_KEY = "quiz-1000-profile";

export async function submitProfile(profile: QuizProfile): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // приватный режим, просто пропускаем
  }

  if (!RESULT_ENDPOINT) return;

  try {
    await fetch(RESULT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
  } catch {
    // молча, квиз не должен ломаться из-за сети
  }
}

export function readStoredProfile(): QuizProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuizProfile) : null;
  } catch {
    return null;
  }
}

"use client";

/**
 * Готовность к Telegram mini app.
 * Грабля из прошлого проекта: window.Telegram.WebApp существует и в обычном
 * браузере, поэтому определяем среду по непустому initData, а не по объекту.
 */

interface TelegramWebApp {
  initData?: string;
  ready?: () => void;
  expand?: () => void;
  viewportStableHeight?: number;
  colorScheme?: string;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  HapticFeedback?: {
    impactOccurred?: (style: string) => void;
    selectionChanged?: () => void;
  };
}

function webApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  const tg = (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram;
  return tg?.WebApp ?? null;
}

export function isInsideTelegram(): boolean {
  const app = webApp();
  return Boolean(app?.initData && app.initData.length > 0);
}

export function initTelegram(background = "#F5F5F5") {
  const app = webApp();
  if (!app || !isInsideTelegram()) return;
  app.ready?.();
  app.expand?.();
  app.setBackgroundColor?.(background);
  app.setHeaderColor?.(background);
}

export function haptic(kind: "select" | "tap" = "select") {
  const app = webApp();
  if (!app || !isInsideTelegram()) return;
  if (kind === "select") app.HapticFeedback?.selectionChanged?.();
  else app.HapticFeedback?.impactOccurred?.("light");
}

/** Системная кнопка «назад» внутри Telegram */
export function bindBackButton(handler: (() => void) | null) {
  const app = webApp();
  const back = app?.BackButton;
  if (!back || !isInsideTelegram()) return () => {};
  if (!handler) {
    back.hide();
    return () => {};
  }
  back.onClick(handler);
  back.show();
  return () => {
    back.offClick(handler);
    back.hide();
  };
}

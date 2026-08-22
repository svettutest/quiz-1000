"use client";

import { motion, useInView, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Объёмные объекты у референса Halo были 3D-рендерами.
 * Пока генерации нет, собираем их геометрией и градиентами.
 */

let coinSeq = 0;

/**
 * Монета в объёме: торец, лицо с косым светом, внутренний ободок и блик.
 * У Halo здесь стоял 3D-рендер, тут та же роль собрана геометрией.
 */
export function Coin({ size = 120, delay = 0 }: { size?: number; delay?: number }) {
  const uid = useRef<string>("");
  if (!uid.current) uid.current = `c${(coinSeq += 1)}`;
  const id = uid.current;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      initial={{ opacity: 0, y: 22, rotate: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`${id}edge`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#7C67C0" />
          <stop offset="40%" stopColor="#5E4E99" />
          <stop offset="100%" stopColor="#3E3369" />
        </linearGradient>
        <linearGradient id={`${id}face`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#F3EEFE" />
          <stop offset="38%" stopColor="#CFC0F1" />
          <stop offset="72%" stopColor="#A78FDF" />
          <stop offset="100%" stopColor="#8672C4" />
        </linearGradient>
        <radialGradient id={`${id}shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5E4E99" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#5E4E99" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* тень на поверхности */}
      <ellipse cx="70" cy="106" rx="54" ry="11" fill={`url(#${id}shadow)`} />
      {/* торец монеты */}
      <ellipse cx="70" cy="82" rx="56" ry="24" fill={`url(#${id}edge)`} />
      <rect x="14" y="66" width="112" height="16" fill={`url(#${id}edge)`} />
      {/* лицо */}
      <ellipse cx="70" cy="66" rx="56" ry="24" fill={`url(#${id}face)`} />
      {/* приподнятый ободок */}
      <ellipse
        cx="70"
        cy="66"
        rx="45"
        ry="18"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.55"
        strokeWidth="2.5"
      />
      {/* знак доллара на лице */}
      <text
        x="70"
        y="74"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill="#6A57AE"
        fillOpacity="0.55"
        fontFamily="var(--font-onest), system-ui, sans-serif"
      >
        $
      </text>
      {/* блик */}
      <ellipse
        cx="44"
        cy="56"
        rx="17"
        ry="5.5"
        fill="#FFFFFF"
        opacity="0.65"
        transform="rotate(-12 44 56)"
      />
    </motion.svg>
  );
}

/** Стопка монет для стартового экрана. */
export function CoinStack() {
  return (
    <div className="relative h-[150px] w-[230px]">
      <div className="absolute left-0 top-6">
        <Coin size={128} delay={0.05} />
      </div>
      <div className="absolute left-[92px] top-0">
        <Coin size={104} delay={0.2} />
      </div>
      <div className="absolute left-[150px] top-[54px]">
        <Coin size={78} delay={0.34} />
      </div>
    </div>
  );
}

/**
 * Мягкое сиреневое свечение вместо видео-фона у Halo.
 * Клипать его нельзя: обрезанный блюр даёт видимый прямоугольный край,
 * поэтому пятна вынесены за пределы блока и ничем не режутся.
 */
export function Halo({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute -inset-32 ${className}`} aria-hidden="true">
      <div
        className="absolute right-4 top-16 h-[420px] w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(197,180,240,0.55) 0%, rgba(197,180,240,0.22) 42%, rgba(197,180,240,0) 72%)",
        }}
      />
      <div
        className="absolute left-0 top-56 h-[360px] w-[360px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(243,214,206,0.5) 0%, rgba(243,214,206,0.18) 45%, rgba(243,214,206,0) 72%)",
        }}
      />
    </div>
  );
}

/** Число, которое собирается на глазах. */
export function Counter({
  value,
  prefix = "",
  className = "",
  duration = 1.1,
  delay = 0,
}: {
  value: number;
  prefix?: string;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, delay]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {shown.toLocaleString("en-US")}
    </span>
  );
}

/** Плавное появление из размытия, приём из Veloce Cards. */
export function BlurIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ filter: "blur(16px)", opacity: 0 }}
      animate={inView ? { filter: "blur(0px)", opacity: 1 } : undefined}
      transition={{ duration: 1, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

import type { NextConfig } from "next";

/**
 * Статический экспорт под GitHub Pages.
 * basePath задаём здесь, а не переменной окружения: из Git Bash значение
 * вида /quiz-1000 разворачивается в путь до Git и билд падает.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  output: "export",
  basePath: "/quiz-1000",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;

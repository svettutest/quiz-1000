import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: "Твой путь к первой $1000 с AI",
  description:
    "Узнай, какой AI-навык тебе проще всего превратить в услугу и как может выглядеть твой путь к первой $1000.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#F5F5F5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={onest.variable}>
      <body style={{ fontFamily: "var(--font-onest), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

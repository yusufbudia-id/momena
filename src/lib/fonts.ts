import { Fraunces, Inter } from "next/font/google";

export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

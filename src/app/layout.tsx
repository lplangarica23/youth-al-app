import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "youth.al — Platforma e rinisë shqiptare",
  description:
    "Mundësi, miq, udhëtime dhe shtëpi për të rinjtë në Shqipëri — një platformë, gjithçka.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

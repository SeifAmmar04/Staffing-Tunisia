"use client";
import { SessionProvider } from "next-auth/react";
import { LangProvider } from "@/context/LangContext";
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
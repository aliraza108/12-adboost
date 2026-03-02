import "@/styles/globals.css";
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { GrainOverlay } from "@/components/layout/GrainOverlay";
import { RouteTransition } from "@/components/layout/RouteTransition";
import { Providers } from "@/components/layout/Providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "AdBoost Studio",
  description: "AI-powered marketing creative optimization engine"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}>
        <Providers>
          <div className="flex min-h-screen bg-sand-50 text-sand-800">
            <Sidebar />
            <div className="flex min-h-screen flex-1 flex-col">
              <TopBar />
              <main className="flex-1 px-6 py-8 pb-28 md:px-10 md:pb-8">
                <div className="mx-auto w-full max-w-[1200px]">
                  <RouteTransition>{children}</RouteTransition>
                </div>
              </main>
            </div>
          </div>
          <GrainOverlay />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PlaygroundStateProvider } from "@/src/hooks/use-playground-state";
import { ConnectionProvider } from "@/src/hooks/use-connection";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { Toaster } from "@/src/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Talk to Overlap",
  description: "Talk to Overlap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PlaygroundStateProvider>
          <ConnectionProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </ConnectionProvider>
        </PlaygroundStateProvider>
      </body>
    </html>
  );
}

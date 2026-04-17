import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frivu Admin",
  description: "Panel de administración Frivu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full bg-zinc-950 text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

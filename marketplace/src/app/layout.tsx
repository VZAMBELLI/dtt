import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { isSimulated } from "@/lib/payments";

const inter = Inter({ subsets: ["latin"], variable: "--f-inter", display: "swap" });
const tight = Inter_Tight({ subsets: ["latin"], variable: "--f-tight", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Secure Privacy Market", template: "%s · Secure Privacy Market" },
  description: "Marketplace curado de segurança: equipamentos, serviços, produtos digitais e especialistas verificados."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${tight.variable} ${mono.variable}`}>
      <body>
        {isSimulated() && <div className="demo">Ambiente de demonstração · pagamentos simulados, nenhum valor é cobrado</div>}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

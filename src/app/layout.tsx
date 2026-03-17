import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Microscope, BookOpen, Mail } from "lucide-react";
import Link from "next/link";

const SITE_URL = "https://medicoshub.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MédicosHub — Artigos Científicos para Médicos Brasileiros",
    template: "%s | MédicosHub",
  },
  description:
    "Plataforma gratuita de curadoria de artigos científicos médicos. PubMed, SciELO, NEJM, Lancet, JAMA — resumidos por IA em português, organizados por especialidade. Newsletter semanal.",
  keywords: [
    "artigos científicos médicos", "medicina baseada em evidências", "PubMed em português",
    "SciELO médicos", "NEJM resumo", "educação médica continuada", "newsletter médica",
    "cardiologia artigos", "oncologia artigos", "neurologia artigos", "medicina Brasil",
    "residência médica", "atualização médica", "MédicosHub",
  ],
  authors: [{ name: "MédicosHub" }],
  creator: "MédicosHub",
  publisher: "MédicosHub",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "MédicosHub",
    title: "MédicosHub — Artigos Científicos para Médicos Brasileiros",
    description: "Curadoria automática de artigos científicos por IA, organizado por especialidade médica. Grátis.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MédicosHub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MédicosHub — Artigos Científicos para Médicos",
    description: "PubMed, SciELO, NEJM e mais — resumidos por IA em português. Grátis.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: SITE_URL },
  verification: { google: "" }, // fill with Search Console token
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="canonical" href={SITE_URL} />
        {/* Structured data — MedicalWebPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "MédicosHub",
            "url": SITE_URL,
            "description": "Curadoria de artigos científicos médicos por IA em português",
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${SITE_URL}/?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          })}}
        />
      </head>
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>

        <footer className="bg-white border-t border-gray-100 mt-16">
          <div className="page-container py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-gradient-to-br from-green-700 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Microscope className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">Médicos<span className="text-green-700">Hub</span></span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Curadoria científica automatizada por IA para médicos brasileiros. Atualizado diariamente.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> Fontes indexadas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["PubMed", "SciELO", "NEJM", "Lancet", "JAMA", "BMJ", "Nature Medicine"].map((src) => (
                    <span key={src} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                      {src}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Newsletter
                </h4>
                <p className="text-sm text-gray-500 mb-3">Receba os melhores artigos toda segunda-feira.</p>
                <Link href="/newsletter" className="btn-primary text-sm py-2">Assinar grátis</Link>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} MédicosHub. Os resumos são gerados por IA e não substituem a leitura do artigo original.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <a href="https://pubmed.ncbi.nlm.nih.gov" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition-colors">PubMed</a>
                <a href="https://www.scielo.br" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition-colors">SciELO</a>
                <Link href="/newsletter" className="hover:text-green-700 transition-colors">Newsletter</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

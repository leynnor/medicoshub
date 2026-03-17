import Link from "next/link";
import { ArticleFeed } from "@/components/articles/ArticleFeed";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { SPECIALTIES_STATIC, SPECIALTY_COLORS } from "@/lib/api";
import { Sparkles, BookOpen, Globe, Zap, ArrowRight } from "lucide-react";

const STATS = [
  { value: "15+", label: "especialidades" },
  { value: "1.000+", label: "periódicos indexados" },
  { value: "Diário", label: "atualização automática" },
  { value: "100%", label: "gratuito" },
];

const SOURCES = ["PubMed", "SciELO", "NEJM", "Lancet", "JAMA", "BMJ", "Nature"];

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mesh-bg text-white">
        <div className="page-container py-16 md:py-20">
          <div className="max-w-3xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Atualizado diariamente por IA
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-5">
              Evidência científica
              <br />
              <span className="text-emerald-300">na sua especialidade</span>
            </h1>

            <p className="text-green-100 text-lg leading-relaxed mb-8 max-w-xl">
              Artigos curados das melhores fontes médicas, resumidos em português
              por IA, organizados por especialidade.
            </p>

            {/* Source pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {SOURCES.map((s) => (
                <span key={s} className="bg-white/10 border border-white/15 text-white/90 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                  {s}
                </span>
              ))}
              <span className="bg-white/10 border border-white/15 text-white/60 text-xs font-semibold px-3 py-1 rounded-full">
                +100 mais
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href="/newsletter" className="inline-flex items-center gap-2 bg-white text-green-900 font-bold px-5 py-3 rounded-xl hover:bg-green-50 transition-all shadow-md hover:shadow-lg text-sm">
                <Sparkles className="w-4 h-4" />
                Newsletter semanal grátis
              </Link>
              <Link href="#feed" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-5 py-3 rounded-xl hover:bg-white/20 transition-all text-sm backdrop-blur-sm">
                Ver artigos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-10 border-t border-white/10">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-sm text-green-200 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="page-container py-10 space-y-12">
        {/* ── Specialties ──────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Especialidades</h2>
            <span className="text-sm text-gray-400">{SPECIALTIES_STATIC.length} áreas</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {SPECIALTIES_STATIC.map((sp) => {
              const colors = SPECIALTY_COLORS[sp.slug] || {
                bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200",
              };
              return (
                <Link
                  key={sp.slug}
                  href={`/${sp.slug}`}
                  className={`group relative overflow-hidden bg-white border ${colors.border} hover:border-transparent rounded-2xl p-4 flex flex-col gap-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
                >
                  {/* Color accent top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <span className={`text-xs font-semibold ${colors.text}`}>{sp.label}</span>
                  <ArrowRight className={`w-3 h-3 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity -mb-1`} />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Why MédicosHub ───────────────────────────────────── */}
        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Globe, title: "Fontes globais", desc: "PubMed, SciELO, NEJM, Lancet, JAMA, BMJ e mais de 100 periódicos indexados automaticamente." },
            { icon: Sparkles, title: "Resumos por IA", desc: "Claude AI classifica, pontua relevância e resume cada artigo em português com linguagem clínica." },
            { icon: Zap, title: "Atualização diária", desc: "Pipeline automatizado busca novos artigos toda manhã, sem necessidade de ação manual." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 flex flex-col gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-green-700" />
              </div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        {/* ── Feed ─────────────────────────────────────────────── */}
        <section id="feed">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Artigos Recentes</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
              <BookOpen className="w-3.5 h-3.5" />
              Todas as especialidades
            </div>
          </div>
          <ArticleFeed />
        </section>

        {/* ── Newsletter CTA ────────────────────────────────────── */}
        <section>
          <div className="relative overflow-hidden bg-gradient-to-br from-green-900 to-emerald-800 rounded-3xl p-10 text-white">
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

            <div className="relative max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                Newsletter gratuita
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3">
                Toda segunda-feira na sua caixa
              </h2>
              <p className="text-green-100 text-base mb-8 max-w-md mx-auto">
                Os melhores artigos da semana, resumidos por IA, organizados pela sua especialidade.
              </p>
              <NewsletterSignup compact />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

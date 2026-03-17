import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SPECIALTIES_STATIC, SPECIALTY_COLORS } from "@/lib/api";
import { ArticleFeed } from "@/components/articles/ArticleFeed";

interface SpecialtyPageProps {
  params: { specialty: string };
}

export async function generateStaticParams() {
  return SPECIALTIES_STATIC.map((sp) => ({ specialty: sp.slug }));
}

export async function generateMetadata({ params }: SpecialtyPageProps): Promise<Metadata> {
  const sp = SPECIALTIES_STATIC.find((s) => s.slug === params.specialty);
  if (!sp) return {};
  return {
    title: `${sp.label} — Artigos Científicos`,
    description: `Artigos científicos de ${sp.label} curados por IA, das melhores fontes nacionais e internacionais.`,
  };
}

export default function SpecialtyPage({ params }: SpecialtyPageProps) {
  const specialty = SPECIALTIES_STATIC.find((s) => s.slug === params.specialty);

  if (!specialty) {
    notFound();
  }

  const colors = SPECIALTY_COLORS[specialty.slug] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  return (
    <div className="page-container py-8">
      {/* Specialty header */}
      <div className={`${colors.bg} border ${colors.border} rounded-2xl px-6 py-8 mb-8`}>
        <div className="flex items-center gap-3 mb-2">
          <span className={`badge ${colors.bg} ${colors.text} border ${colors.border} text-sm px-3 py-1`}>
            Especialidade
          </span>
        </div>
        <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>{specialty.label}</h1>
        <p className="text-gray-600">
          Artigos científicos de {specialty.label} curados por IA e resumidos em português.
          Atualizados diariamente com as melhores publicações do PubMed, SciELO e principais periódicos.
        </p>
      </div>

      {/* Article feed filtered by specialty */}
      <ArticleFeed specialtySlug={params.specialty} specialtyLabel={specialty.label} />
    </div>
  );
}

import { ExternalLink, Users, BookOpen, Calendar, Sparkles, TrendingUp } from "lucide-react";
import { Article, SPECIALTY_COLORS, SOURCE_COLORS, SPECIALTIES_STATIC } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

function SourceBadge({ source, journal }: { source: string; journal: string }) {
  const colors = SOURCE_COLORS[source] || { bg: "bg-gray-100", text: "text-gray-700" };
  const label =
    source === "pubmed" ? "PubMed"
    : source === "scielo" ? "SciELO"
    : journal || "Periódico";

  return (
    <span className={`badge ${colors.bg} ${colors.text} font-semibold`}>{label}</span>
  );
}

function SpecialtyBadge({ specialty }: { specialty: string | null }) {
  if (!specialty) return null;
  const sp = SPECIALTIES_STATIC.find((s) => s.slug === specialty);
  if (!sp) return null;
  const colors = SPECIALTY_COLORS[specialty] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
  return (
    <span className={`badge ${colors.bg} ${colors.text} border ${colors.border}`}>
      {sp.label}
    </span>
  );
}

function ImpactIndicator({ score, impact }: { score: number | null; impact: number | null }) {
  if (!score) return null;
  const level = score >= 9 ? "high" : score >= 7 ? "mid" : "low";
  const config = {
    high: { label: "Alta relevância", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    mid:  { label: "Relevante", color: "text-amber-700 bg-amber-50 border-amber-200" },
    low:  { label: "Informativo", color: "text-gray-600 bg-gray-50 border-gray-200" },
  }[level];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${config.color}`}>
      <TrendingUp className="w-3 h-3" />
      {config.label} {score.toFixed(1)}
    </span>
  );
}

function formatAuthors(authors: string[]): string {
  if (!authors?.length) return "";
  return authors.length <= 2 ? authors.join(", ") : `${authors[0]} et al.`;
}

function formatDate(dateStr: string | null, createdAt: string): string {
  if (dateStr) return dateStr;
  try { return formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ptBR }); }
  catch { return ""; }
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const authorsStr = formatAuthors(article.authors);
  const dateStr = formatDate(article.published_date, article.created_at);

  return (
    <article className={`group relative bg-white rounded-2xl border transition-all duration-200
      hover:shadow-lg hover:-translate-y-1 flex flex-col
      ${featured
        ? "border-green-200 shadow-md ring-1 ring-green-100"
        : "border-gray-100 shadow-sm hover:border-gray-200"
      }`}
    >
      {/* Featured accent */}
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-500 rounded-t-2xl" />
      )}

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <SpecialtyBadge specialty={article.specialty} />
          <SourceBadge source={article.source} journal={article.journal} />
          {featured && (
            <span className="badge bg-green-800 text-white">
              <Sparkles className="w-2.5 h-2.5" /> Destaque
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-3">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-800 transition-colors"
          >
            {article.title}
          </a>
        </h3>

        {/* Meta */}
        <div className="flex flex-col gap-1">
          {authorsStr && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Users className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{authorsStr}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-medium text-gray-600">{article.journal}</span>
            </div>
            {dateStr && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                {dateStr}
              </div>
            )}
          </div>
        </div>

        {/* AI Summary */}
        {article.summary_pt && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-100 rounded-xl px-4 py-3">
            <div className="ai-badge mb-2">
              <Sparkles className="w-2.5 h-2.5" />
              Resumo IA
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">{article.summary_pt}</p>
          </div>
        )}

        {/* Abstract fallback */}
        {!article.summary_pt && article.abstract && (
          <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{article.abstract}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
        <ImpactIndicator score={article.relevance_score} impact={article.impact_factor} />
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-900 transition-colors group-hover:underline"
        >
          Ver artigo
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
}

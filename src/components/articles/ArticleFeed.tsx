"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import { ArticleFilters, FiltersState } from "./ArticleFilters";
import { articlesApi, Article, ArticleListResponse } from "@/lib/api";

interface ArticleFeedProps {
  specialtySlug?: string;
  specialtyLabel?: string;
}

const DEFAULT_FILTERS: FiltersState = {
  source: "",
  days: 30,
  q: "",
};

export function ArticleFeed({ specialtySlug, specialtyLabel }: ArticleFeedProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 12;

  const fetchArticles = useCallback(
    async (currentPage: number, currentFilters: FiltersState) => {
      setLoading(true);
      setError(null);
      try {
        const data: ArticleListResponse = await articlesApi.list({
          specialty: specialtySlug,
          source: currentFilters.source || undefined,
          days: currentFilters.days,
          q: currentFilters.q || undefined,
          page: currentPage,
          limit: LIMIT,
        });
        setArticles(data.items);
        setTotal(data.total);
        setHasMore(data.has_more);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError("Não foi possível carregar os artigos. Verifique se a API está online.");
      } finally {
        setLoading(false);
      }
    },
    [specialtySlug]
  );

  // Fetch on mount and when filters/page change
  useEffect(() => {
    fetchArticles(page, filters);
  }, [page, filters, fetchArticles]);

  // Reset page when filters change
  function handleFiltersChange(newFilters: FiltersState) {
    setFilters(newFilters);
    setPage(1);
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ArticleFilters filters={filters} onChange={handleFiltersChange} />

      {/* Results info */}
      {!loading && !error && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {total > 0 ? (
              <>
                <span className="font-medium text-gray-900">{total}</span> artigos
                {specialtyLabel ? ` de ${specialtyLabel}` : ""}
              </>
            ) : (
              "Nenhum artigo encontrado"
            )}
          </span>
          <button
            onClick={() => fetchArticles(page, filters)}
            className="flex items-center gap-1 hover:text-green-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Atualizar
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm">Carregando artigos...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-gray-600 text-center max-w-sm">{error}</p>
          <button
            onClick={() => fetchArticles(page, filters)}
            className="btn-secondary text-sm"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <div className="text-5xl">📄</div>
          <p className="text-gray-600 font-medium">Nenhum artigo encontrado</p>
          <p className="text-sm text-gray-400 text-center">
            Tente ajustar os filtros ou aguarde a próxima atualização diária.
          </p>
          <button
            onClick={() => {
              handleFiltersChange(DEFAULT_FILTERS);
            }}
            className="btn-secondary text-sm"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Article grid */}
      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {articles.map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article}
              featured={idx === 0 && page === 1 && (article.relevance_score ?? 0) >= 8}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    pageNum === page
                      ? "bg-green-700 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={!hasMore}
            className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

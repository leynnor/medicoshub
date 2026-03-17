"use client";

import { Search, Filter } from "lucide-react";

export interface FiltersState {
  source: string;
  days: number;
  q: string;
}

interface ArticleFiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
}

const SOURCES = [
  { value: "", label: "Todas as fontes" },
  { value: "pubmed", label: "PubMed" },
  { value: "scielo", label: "SciELO" },
  { value: "rss", label: "Periódicos" },
];

const PERIODS = [
  { value: 1, label: "Hoje" },
  { value: 7, label: "7 dias" },
  { value: 30, label: "30 dias" },
  { value: 90, label: "3 meses" },
];

export function ArticleFilters({ filters, onChange }: ArticleFiltersProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar artigos..."
            value={filters.q}
            onChange={(e) => onChange({ ...filters, q: e.target.value })}
            className="input pl-9 text-sm"
          />
        </div>

        {/* Source filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {SOURCES.map((src) => (
              <button
                key={src.value}
                onClick={() => onChange({ ...filters, source: src.value })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filters.source === src.value
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>
        </div>

        {/* Period filter */}
        <div className="flex flex-wrap gap-1.5">
          {PERIODS.map((period) => (
            <button
              key={period.value}
              onClick={() => onChange({ ...filters, days: period.value })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filters.days === period.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

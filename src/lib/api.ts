const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Article {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  published_date: string | null;
  doi: string | null;
  url: string;
  abstract: string | null;
  summary_pt: string | null;
  specialty: string | null;
  source: "pubmed" | "scielo" | "rss";
  relevance_score: number | null;
  impact_factor: number | null;
  created_at: string;
}

export interface ArticleListResponse {
  items: Article[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface ArticleFilters {
  specialty?: string;
  source?: string;
  days?: number;
  q?: string;
  page?: number;
  limit?: number;
}

export interface Specialty {
  slug: string;
  label: string;
  icon: string;
  color: string;
  article_count: number;
}

export interface SubscriberData {
  email: string;
  name: string;
  specialties: string[];
}

export interface NewsletterPreview {
  id: string | null;
  subject: string | null;
  html_content: string | null;
  articles_count: number | null;
  sent_at: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildQueryString(params: Record<string, unknown>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${errorBody}`);
  }

  return res.json() as Promise<T>;
}

// ─── Articles API ─────────────────────────────────────────────────────────────

export const articlesApi = {
  list: (filters: ArticleFilters = {}): Promise<ArticleListResponse> => {
    const qs = buildQueryString(filters as Record<string, unknown>);
    return apiFetch<ArticleListResponse>(`/articles/${qs}`);
  },

  featured: (limit = 6): Promise<Article[]> => {
    return apiFetch<Article[]>(`/articles/featured?limit=${limit}`);
  },

  getById: (id: string): Promise<Article> => {
    return apiFetch<Article>(`/articles/${id}`);
  },

  getBySpecialty: (specialty: string, filters: ArticleFilters = {}): Promise<ArticleListResponse> => {
    const qs = buildQueryString({ ...filters, specialty } as Record<string, unknown>);
    return apiFetch<ArticleListResponse>(`/articles/${qs}`);
  },
};

// ─── Specialties API ──────────────────────────────────────────────────────────

export const specialtiesApi = {
  list: (): Promise<Specialty[]> => {
    return apiFetch<Specialty[]>("/specialties/");
  },

  getBySlug: (slug: string): Promise<Specialty> => {
    return apiFetch<Specialty>(`/specialties/${slug}`);
  },
};

// ─── Newsletter API ───────────────────────────────────────────────────────────

export const newsletterApi = {
  subscribe: (data: SubscriberData): Promise<{ id: string; email: string }> => {
    return apiFetch("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  unsubscribe: (email: string): Promise<{ success: boolean }> => {
    return apiFetch("/newsletter/unsubscribe", {
      method: "DELETE",
      body: JSON.stringify({ email }),
    });
  },

  preview: (): Promise<NewsletterPreview> => {
    return apiFetch<NewsletterPreview>("/newsletter/preview");
  },
};

// ─── Static specialty data (for SSG / no API call needed) ────────────────────

export const SPECIALTIES_STATIC = [
  { slug: "cardiologia", label: "Cardiologia", icon: "heart", color: "red" },
  { slug: "oncologia", label: "Oncologia", icon: "microscope", color: "purple" },
  { slug: "neurologia", label: "Neurologia", icon: "brain", color: "indigo" },
  { slug: "endocrinologia", label: "Endocrinologia", icon: "activity", color: "yellow" },
  { slug: "pediatria", label: "Pediatria", icon: "users", color: "green" },
  { slug: "psiquiatria", label: "Psiquiatria", icon: "brain", color: "teal" },
  { slug: "ginecologia", label: "Ginecologia e Obstetrícia", icon: "heart", color: "pink" },
  { slug: "infectologia", label: "Infectologia", icon: "shield", color: "orange" },
  { slug: "cirurgia", label: "Cirurgia", icon: "scissors", color: "gray" },
  { slug: "clinica-medica", label: "Clínica Médica", icon: "stethoscope", color: "blue" },
  { slug: "reumatologia", label: "Reumatologia", icon: "activity", color: "amber" },
  { slug: "nefrologia", label: "Nefrologia", icon: "droplet", color: "cyan" },
  { slug: "pneumologia", label: "Pneumologia", icon: "wind", color: "sky" },
  { slug: "gastroenterologia", label: "Gastroenterologia", icon: "activity", color: "lime" },
  { slug: "dermatologia", label: "Dermatologia", icon: "layers", color: "rose" },
] as const;

export type SpecialtySlug = typeof SPECIALTIES_STATIC[number]["slug"];

// ─── Color map ────────────────────────────────────────────────────────────────

export const SPECIALTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  cardiologia: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  oncologia: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  neurologia: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  endocrinologia: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  pediatria: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  psiquiatria: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  ginecologia: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  infectologia: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  cirurgia: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
  "clinica-medica": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  reumatologia: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  nefrologia: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  pneumologia: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  gastroenterologia: { bg: "bg-lime-50", text: "text-lime-700", border: "border-lime-200" },
  dermatologia: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

export const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  pubmed: { bg: "bg-blue-100", text: "text-blue-800" },
  scielo: { bg: "bg-teal-100", text: "text-teal-800" },
  rss: { bg: "bg-amber-100", text: "text-amber-800" },
};

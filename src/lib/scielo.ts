/**
 * SciELO Search client — serverless.
 * Docs: https://search.scielo.org/help
 */

export interface ScieloArticle {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  published_date: string;
  doi: string;
  url: string;
  abstract: string;
  source: "scielo";
  relevance_score: number;
  impact_factor: number;
}

const SPECIALTY_QUERIES: Record<string, string> = {
  cardiologia:       "insuficiência cardíaca OR cardiopatia OR infarto",
  oncologia:         "câncer OR neoplasia OR quimioterapia",
  neurologia:        "AVC OR epilepsia OR doença de Parkinson",
  endocrinologia:    "diabetes OR obesidade OR tireoide",
  pediatria:         "pediatria OR neonatal OR criança",
  psiquiatria:       "depressão OR ansiedade OR esquizofrenia",
  ginecologia:       "gestação OR pré-eclâmpsia OR ginecologia",
  infectologia:      "sepse OR resistência bacteriana OR infecção",
  cirurgia:          "cirurgia laparoscópica OR complicações cirúrgicas",
  "clinica-medica":  "hipertensão arterial OR dislipidemia OR medicina interna",
  reumatologia:      "artrite reumatoide OR lúpus OR fibromialgia",
  nefrologia:        "doença renal crônica OR hemodiálise",
  pneumologia:       "asma OR DPOC OR pneumonia",
  gastroenterologia: "doença inflamatória intestinal OR hepatite OR gastroenterologia",
  dermatologia:      "psoríase OR dermatite atópica OR melanoma",
};

function first(val: unknown, def = ""): string {
  if (Array.isArray(val)) return (val[0] as string) ?? def;
  return (val as string) ?? def;
}

export async function searchScielo(opts: {
  specialty?: string;
  q?: string;
  limit?: number;
}): Promise<ScieloArticle[]> {
  const { specialty, q, limit = 8 } = opts;
  const term = q || (specialty && SPECIALTY_QUERIES[specialty]) || "medicina";

  const url =
    `https://search.scielo.org/?q=${encodeURIComponent(term)}` +
    `&lang=pt&count=${limit}&from=0&output=json&format=json`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const hits = (data?.hits?.hits ?? []) as Array<{ _source: Record<string, unknown> }>;

    return hits.map((hit, i) => {
      const src = hit._source ?? {};
      const doi = first(src.doi ?? src["doi_"]);
      const pid = first(src.id ?? src.ur ?? "");
      const url_ = doi
        ? `https://doi.org/${doi}`
        : pid
        ? `https://www.scielo.br/article/${pid}/`
        : "";

      return {
        id: `scielo-${pid || i}`,
        title: first(src.ti ?? src.ti_en ?? "Título não disponível"),
        authors: Array.isArray(src.au) ? (src.au as string[]).slice(0, 4) : [],
        journal: first(src.ta ?? ""),
        published_date: first(src.dp ?? ""),
        doi,
        url: url_,
        abstract: first(src.ab ?? src.ab_en ?? ""),
        source: "scielo" as const,
        relevance_score: Math.random() * 1.5 + 7,
        impact_factor: 0,
      };
    });
  } catch {
    return [];
  }
}

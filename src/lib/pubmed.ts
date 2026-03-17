/**
 * PubMed E-utilities client — serverless, no API key required.
 * Docs: https://www.ncbi.nlm.nih.gov/books/NBK25501/
 */

const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const EMAIL = "contato@medicoshub.com.br";
const TOOL  = "medicoshub";

export interface PubMedArticle {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  published_date: string;
  doi: string;
  url: string;
  abstract: string;
  source: "pubmed";
  relevance_score: number;
  impact_factor: number;
}

const SPECIALTY_QUERIES: Record<string, string> = {
  cardiologia:       "heart failure[MeSH] OR coronary artery disease[MeSH] OR cardiology[MeSH]",
  oncologia:         "neoplasms[MeSH] OR cancer therapy[MeSH] OR immunotherapy[MeSH]",
  neurologia:        "stroke[MeSH] OR epilepsy[MeSH] OR neurodegeneration[MeSH]",
  endocrinologia:    "diabetes mellitus[MeSH] OR obesity[MeSH] OR thyroid diseases[MeSH]",
  pediatria:         "pediatrics[MeSH] OR child health[MeSH] OR neonatology[MeSH]",
  psiquiatria:       "depression[MeSH] OR schizophrenia[MeSH] OR anxiety disorders[MeSH]",
  ginecologia:       "obstetrics[MeSH] OR gynecology[MeSH] OR pregnancy complications[MeSH]",
  infectologia:      "communicable diseases[MeSH] OR antibiotic resistance[MeSH] OR sepsis[MeSH]",
  cirurgia:          "surgical procedures[MeSH] OR laparoscopy[MeSH] OR surgical complications[MeSH]",
  "clinica-medica":  "hypertension[MeSH] OR internal medicine[MeSH] OR dyslipidemia[MeSH]",
  reumatologia:      "arthritis[MeSH] OR lupus erythematosus[MeSH] OR rheumatology[MeSH]",
  nefrologia:        "kidney diseases[MeSH] OR hemodialysis[MeSH] OR chronic kidney disease[MeSH]",
  pneumologia:       "asthma[MeSH] OR COPD[MeSH] OR respiratory tract diseases[MeSH]",
  gastroenterologia: "inflammatory bowel disease[MeSH] OR liver diseases[MeSH] OR gastroenterology[MeSH]",
  dermatologia:      "dermatology[MeSH] OR skin diseases[MeSH] OR psoriasis[MeSH]",
};

async function fetchWithCache(url: string, revalidate = 3600) {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`PubMed request failed: ${res.status}`);
  return res.json();
}

export async function searchPubMed(opts: {
  specialty?: string;
  q?: string;
  limit?: number;
  days?: number;
}): Promise<PubMedArticle[]> {
  const { specialty, q, limit = 12, days = 90 } = opts;

  // Build query
  let term = q || (specialty && SPECIALTY_QUERIES[specialty]) || "medicine[MeSH]";
  if (days < 365) {
    const from = new Date();
    from.setDate(from.getDate() - days);
    const dateStr = from.toISOString().slice(0, 10).replace(/-/g, "/");
    term += ` AND ("${dateStr}"[PDAT] : "3000"[PDAT])`;
  }

  // 1. Search → get PMIDs
  const searchUrl =
    `${BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}` +
    `&retmax=${limit}&sort=relevance&retmode=json&tool=${TOOL}&email=${EMAIL}`;

  const searchData = await fetchWithCache(searchUrl, 3600);
  const ids: string[] = searchData?.esearchresult?.idlist ?? [];
  if (ids.length === 0) return [];

  // 2. Summary → get metadata
  const summaryUrl =
    `${BASE}/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json&tool=${TOOL}&email=${EMAIL}`;
  const summaryData = await fetchWithCache(summaryUrl, 3600);
  const uids: string[] = summaryData?.result?.uids ?? [];

  return uids.map((uid) => {
    const doc = summaryData.result[uid] ?? {};
    const authors: string[] = (doc.authors ?? []).slice(0, 5).map((a: { name: string }) => a.name);
    const doi = (doc.articleids ?? []).find((x: { idtype: string; value: string }) => x.idtype === "doi")?.value ?? "";
    const pubDate = doc.pubdate ?? doc.epubdate ?? "";

    return {
      id: `pubmed-${uid}`,
      title: doc.title ?? "Título não disponível",
      authors,
      journal: doc.fulljournalname ?? doc.source ?? "",
      published_date: pubDate,
      doi,
      url: doi ? `https://doi.org/${doi}` : `https://pubmed.ncbi.nlm.nih.gov/${uid}/`,
      abstract: "",
      source: "pubmed" as const,
      relevance_score: Math.random() * 2 + 7.5, // placeholder until Claude scores
      impact_factor: 0,
    };
  });
}

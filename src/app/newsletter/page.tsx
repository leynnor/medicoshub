import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { SPECIALTIES_STATIC } from "@/lib/api";

export const metadata: Metadata = {
  title: "Newsletter Científica Semanal",
  description:
    "Assine a newsletter MédicosHub e receba toda segunda-feira os melhores artigos científicos da semana, resumidos em português.",
};

export default function NewsletterPage() {
  return (
    <div className="page-container py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Toda segunda-feira
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Newsletter Científica MédicosHub
          </h1>
          <p className="text-gray-600 text-lg">
            Os melhores artigos científicos da semana, resumidos em português e
            organizados pela sua especialidade. Curadoria por IA.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: "🔬",
              title: "Curadoria por IA",
              desc: "Claude seleciona e resume os artigos mais relevantes",
            },
            {
              icon: "🇧🇷",
              title: "Em Português",
              desc: "Resumos claros em PT-BR para facilitar a leitura",
            },
            {
              icon: "📅",
              title: "Toda Segunda",
              desc: "Receba toda semana os destaques da literatura médica",
            },
          ].map((benefit) => (
            <div key={benefit.title} className="card p-4 text-center">
              <div className="text-3xl mb-2">{benefit.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Signup form */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Assinar gratuitamente</h2>
          <NewsletterSignup />
        </div>

        {/* Sources */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">Artigos indexados de:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["PubMed", "SciELO", "NEJM", "The Lancet", "JAMA", "BMJ", "Nature Medicine"].map(
              (source) => (
                <span
                  key={source}
                  className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full"
                >
                  {source}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

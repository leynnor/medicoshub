"use client";

import { useState } from "react";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { newsletterApi, SPECIALTIES_STATIC } from "@/lib/api";

interface NewsletterSignupProps {
  compact?: boolean;
}

type FormState = "idle" | "loading" | "success" | "error";

export function NewsletterSignup({ compact = false }: NewsletterSignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function toggleSpecialty(slug: string) {
    setSelectedSpecialties((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setFormState("loading");
    setErrorMsg("");

    try {
      await newsletterApi.subscribe({
        email: email.trim(),
        name: name.trim() || email.trim().split("@")[0],
        specialties: selectedSpecialties,
      });
      setFormState("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setErrorMsg(msg.includes("422") ? "E-mail inválido." : "Erro ao cadastrar. Tente novamente.");
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Inscrição confirmada!</h3>
          <p className="text-gray-600 text-sm">
            Você receberá a newsletter toda segunda-feira.
            <br />
            Verifique sua caixa de entrada.
          </p>
        </div>
        <button
          onClick={() => {
            setFormState("idle");
            setEmail("");
            setName("");
            setSelectedSpecialties([]);
          }}
          className="text-sm text-green-700 hover:underline"
        >
          Cadastrar outro e-mail
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={formState === "loading"}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
        >
          {formState === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          Assinar grátis
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="label" htmlFor="name">
          Seu nome
        </label>
        <input
          id="name"
          type="text"
          placeholder="Dr. João Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
      </div>

      {/* Email */}
      <div>
        <label className="label" htmlFor="email">
          E-mail <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
      </div>

      {/* Specialty selection */}
      <div>
        <label className="label">
          Especialidades de interesse{" "}
          <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Selecione para receber artigos personalizados. Se não selecionar, você receberá todas as
          especialidades.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SPECIALTIES_STATIC.map((sp) => {
            const selected = selectedSpecialties.includes(sp.slug);
            return (
              <button
                key={sp.slug}
                type="button"
                onClick={() => toggleSpecialty(sp.slug)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  selected
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {sp.label}
              </button>
            );
          })}
        </div>
        {selectedSpecialties.length > 0 && (
          <p className="text-xs text-green-700 mt-2">
            {selectedSpecialties.length} especialidade(s) selecionada(s)
          </p>
        )}
      </div>

      {/* Error */}
      {formState === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={formState === "loading" || !email.trim()}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {formState === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Cadastrando...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            Assinar newsletter gratuitamente
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Sem spam. Cancele a qualquer momento.
      </p>
    </form>
  );
}

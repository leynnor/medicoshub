"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SPECIALTIES_STATIC, SPECIALTY_COLORS } from "@/lib/api";

interface SpecialtyNavProps {
  counts?: Record<string, number>;
}

export function SpecialtyNav({ counts = {} }: SpecialtyNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      <Link
        href="/"
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          pathname === "/"
            ? "bg-green-50 text-green-700"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <span>Todos os artigos</span>
        {counts["_all"] != null && (
          <span className="text-xs text-gray-400 font-normal">{counts["_all"]}</span>
        )}
      </Link>

      <div className="pt-2 pb-1">
        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Especialidades
        </p>
      </div>

      {SPECIALTIES_STATIC.map((sp) => {
        const colors = SPECIALTY_COLORS[sp.slug] || {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
        };
        const isActive = pathname === `/${sp.slug}`;

        return (
          <Link
            key={sp.slug}
            href={`/${sp.slug}`}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? `${colors.bg} ${colors.text}`
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isActive ? colors.text.replace("text-", "bg-") : "bg-gray-300"
                }`}
              />
              <span className="truncate">{sp.label}</span>
            </div>
            {counts[sp.slug] != null && (
              <span className="text-xs text-gray-400 font-normal ml-1 flex-shrink-0">
                {counts[sp.slug]}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

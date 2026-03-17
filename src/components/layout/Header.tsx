"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell, Microscope } from "lucide-react";
import { SPECIALTIES_STATIC } from "@/lib/api";

const NAV_SPECIALTIES = SPECIALTIES_STATIC.slice(0, 7);

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="glass sticky top-0 z-50 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-green-700 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Microscope className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Médicos<span className="text-green-700">Hub</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_SPECIALTIES.map((sp) => (
              <Link
                key={sp.slug}
                href={`/${sp.slug}`}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  pathname === `/${sp.slug}`
                    ? "bg-green-800 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {sp.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-gray-200 mx-2" />
            <Link
              href="/newsletter"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                pathname === "/newsletter"
                  ? "bg-green-800 text-white shadow-sm"
                  : "bg-green-50 text-green-800 hover:bg-green-100 border border-green-200"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Newsletter
            </Link>
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/newsletter" className="btn-primary py-1.5 px-3 text-sm">
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Newsletter</span>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-ghost p-2"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100/80 bg-white/90 backdrop-blur-md">
          <div className="page-container py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
              Especialidades
            </p>
            <div className="grid grid-cols-2 gap-1">
              {SPECIALTIES_STATIC.map((sp) => (
                <Link
                  key={sp.slug}
                  href={`/${sp.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    pathname === `/${sp.slug}`
                      ? "bg-green-800 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {sp.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

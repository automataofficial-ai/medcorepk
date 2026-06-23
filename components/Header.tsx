"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide header on dashboard and block pages only
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/block")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Syllabus", href: "/syllabus" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Resources", href: "#resources" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full py-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Header Card */}
        <div
          className="rounded-3xl px-6 md:px-10 py-5 backdrop-blur-xl transition-all duration-300 border"
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            borderColor: "rgba(99, 102, 241, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex items-center justify-between gap-8">

            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0 hover:opacity-80 transition-opacity duration-300">
              <img src="/logo.svg" alt="MedCore Logo" className="h-20 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative px-5 py-3 text-sm font-semibold text-white hover:text-white rounded-2xl transition-all duration-300"
                  style={{
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(100, 116, 139, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Sign In / Login Button */}
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35)",
                }}
              >
                Sign In
                <span className="text-lg">→</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-3 text-white hover:text-white transition-all duration-300 rounded-2xl"
                style={{
                  background: mobileMenuOpen ? "rgba(100, 116, 139, 0.2)" : "transparent",
                }}
              >
                {mobileMenuOpen ? (
                  <X size={28} />
                ) : (
                  <Menu size={28} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-6 pt-6 pb-2 flex flex-col gap-3 border-t"
              style={{ borderColor: "rgba(99, 102, 241, 0.2)" }}>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group px-5 py-3 text-sm font-semibold text-white hover:text-white rounded-2xl transition-all duration-300"
                  style={{
                    background: "rgba(100, 116, 139, 0.08)",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="mt-2 px-5 py-3.5 text-sm font-bold text-white rounded-2xl text-center transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
                <span>→</span>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

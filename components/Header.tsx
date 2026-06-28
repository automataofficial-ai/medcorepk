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
          className="rounded-full px-6 md:px-12 py-3 md:py-4 backdrop-blur-2xl transition-all duration-300 border hover:shadow-2xl hover:border-blue-500/40"
          style={{
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.7) 100%)",
            borderColor: "rgba(59, 130, 246, 0.4)",
            boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 0 60px rgba(59, 130, 246, 0.1)",
          }}
        >
          <div className="flex items-center justify-between gap-8">

            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 hover:opacity-80 transition-opacity duration-300">
              <img src="/logo.png" alt="MedCore Logo" className="h-10 sm:h-16 md:h-20 w-auto" />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-xl font-black text-white leading-tight">MedCore</span>
                <span className="text-xs text-cyan-400 font-semibold">crystal clear concepts</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative px-6 py-3 text-sm font-semibold text-white hover:text-white rounded-full transition-all duration-300 hover:bg-white/10"
                  style={{
                    background: "transparent",
                  }}
                >
                  {item.label}
                  <span className="absolute bottom-1 left-6 right-6 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Sign In / Login Button */}
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #0891b2 0%, #006b7f 100%)",
                  boxShadow: "0 12px 32px rgba(8, 145, 178, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
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
            <nav className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl flex flex-col gap-2 border z-40 animate-in fade-in slide-in-from-top-2"
              style={{
                borderColor: "rgba(99, 102, 241, 0.3)",
                background: "linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 27, 75, 0.8))",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)"
              }}>
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-3 text-sm font-semibold text-white hover:text-cyan-400 rounded-lg transition-all duration-300"
                    style={{
                      background: "rgba(99, 102, 241, 0.1)",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="block px-4 py-3 text-sm font-bold text-white rounded-lg text-center transition-all duration-300 mt-3 border-t"
                  style={{
                    background: "linear-gradient(135deg, #00CED1, #00B5CC)",
                    borderColor: "rgba(99, 102, 241, 0.2)"
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In →
                </Link>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "../icons/logo";
import { Sparkles, Menu, X, ChevronRight, Home, Palette, Layers, Tag, Images, HelpCircle, BookOpen } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "#",            label: "Home",    icon: Home },
  { href: "#gaya",        label: "Gaya",    icon: Palette },
  { href: "#services",    label: "Layanan", icon: Layers },
  { href: "#how-it-works",label: "Harga",   icon: Tag },
  { href: "#showcase",    label: "Galeri",  icon: Images },
  { href: "#faq",         label: "FAQ",     icon: HelpCircle },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="group relative px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground">
      <span className="absolute inset-0 rounded-full scale-90 opacity-0 bg-gradient-to-r from-purple-500/10 via-primary/10 to-cyan-500/10 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100" />
      <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 group-hover:w-4/5" />
      <span className="relative">{label}</span>
    </a>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-[85vw] max-w-sm flex flex-col bg-background border-l border-border/50 shadow-2xl transition-transform duration-300 ease-out pt-[env(safe-area-inset-top)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-20 -left-10 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-600/10 blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between px-6 py-5 border-b border-border/50">
          <Logo className="h-5 w-auto" />
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Tutup menu</span>
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Navigasi
          </p>
          <div className="flex flex-col gap-1">
            {navLinks.map(({ href, label, icon: Icon }, i) => (
              <a
                key={href}
                href={href}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-xl px-3 py-3.5 text-muted-foreground transition-all duration-150 hover:bg-muted/60 hover:text-foreground active:scale-[0.98]"
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/10 to-cyan-500/10 ring-1 ring-border/50 transition-colors group-hover:from-purple-500/20 group-hover:to-cyan-500/20">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </span>
                <span className="flex-1 text-base font-medium">{label}</span>
                <ChevronRight className="h-4 w-4 opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0" />
              </a>
            ))}

            <div className="my-3 border-t border-border/40" />

            <Link
              href="/blog"
              onClick={onClose}
              className="group flex items-center gap-3 rounded-xl px-3 py-3.5 text-muted-foreground transition-all duration-150 hover:bg-muted/60 hover:text-foreground active:scale-[0.98]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/10 to-cyan-500/10 ring-1 ring-border/50 transition-colors group-hover:from-purple-500/20 group-hover:to-cyan-500/20">
                <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </span>
              <span className="flex-1 text-base font-medium">Blog</span>
              <span className="rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-2 py-0.5 text-[10px] font-bold text-white">
                NEW
              </span>
            </Link>
          </div>
        </nav>

        <div className="relative border-t border-border/50 px-4 py-5 space-y-3">
          <a
            href="#order"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-transform"
          >
            <Sparkles className="h-4 w-4" />
            Pesan Sekarang
          </a>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground">Ganti tema tampilan</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="px-4 lg:px-6 h-[calc(4rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-30 border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center justify-center">
            <Logo className="h-6 w-auto" />
            <span className="sr-only">AI Jasa Edit</span>
          </a>

          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
            <Link href="/blog" className="group relative px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground">
              <span className="absolute inset-0 rounded-full scale-90 opacity-0 bg-gradient-to-r from-purple-500/10 via-primary/10 to-cyan-500/10 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100" />
              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 group-hover:w-4/5" />
              <span className="relative">Blog</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <ThemeToggle />
              <Button asChild className="relative overflow-hidden group">
                <a href="#order">
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Sparkles className="relative mr-2 h-4 w-4" />
                  <span className="relative">Pesan Sekarang</span>
                </a>
              </Button>
            </div>

            <div className="sm:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};

export default Header;

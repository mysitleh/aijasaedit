"use client";

import { Home, Images, Sparkles, Users, Menu as MenuIcon } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (delta < -8 || currentY < 80) {
        setVisible(true);
      } else if (delta > 8) {
        setVisible(false);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Don't show on admin pages — after all hooks
  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[60] block sm:hidden transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="relative bg-background/90 backdrop-blur-xl border-t border-border/50 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-around h-14 px-1">
          <a
            href="#"
            className="flex flex-col items-center justify-center flex-1 gap-0.5 text-muted-foreground active:text-primary transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">Home</span>
          </a>

          <a
            href="#showcase"
            className="flex flex-col items-center justify-center flex-1 gap-0.5 text-muted-foreground active:text-primary transition-colors"
          >
            <Images className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">Galeri</span>
          </a>

          {/* Primary Action — slightly raised */}
          <div className="relative flex-1 flex flex-col items-center -mt-5">
            <a
              href="#order"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/30 border-[3px] border-background active:scale-95 transition-transform"
            >
              <Sparkles className="h-5 w-5 text-white" />
            </a>
            <span className="text-[9px] font-bold text-primary mt-1 uppercase tracking-tight">
              Pesan
            </span>
          </div>

          <Link
            href="/affiliate"
            className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors ${
              pathname === "/affiliate"
                ? "text-emerald-500"
                : "text-muted-foreground active:text-primary"
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">
              Affiliate
            </span>
          </Link>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-mobile-menu'));
            }}
            className="flex flex-col items-center justify-center flex-1 gap-0.5 text-muted-foreground active:text-primary transition-colors"
          >
            <MenuIcon className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">
              Lainnya
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

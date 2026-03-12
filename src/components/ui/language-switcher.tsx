"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  return (
    <Link
      href={isEnglish ? "/" : "/en"}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
      title={isEnglish ? "Ganti ke Bahasa Indonesia" : "Switch to English"}
    >
      <Globe className="h-3.5 w-3.5" />
      {isEnglish ? "🇮🇩 ID" : "🇬🇧 EN"}
    </Link>
  );
}

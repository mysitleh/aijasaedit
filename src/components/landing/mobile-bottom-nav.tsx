"use client";

import { Home, Images, Sparkles, Users, Menu as MenuIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("home");

  // Only show on root layout and mobile
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] block sm:hidden">
      {/* Background glass with safe area and border */}
      <div className="relative bg-background/80 backdrop-blur-xl border-t border-border/50 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around h-16 px-2">
          
          <a 
            href="#" 
            className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('home')}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">Home</span>
          </a>

          <a 
            href="#showcase" 
            className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${activeTab === 'galeri' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('galeri')}
          >
            <Images className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">Galeri</span>
          </a>

          {/* Centered Primary Action */}
          <div className="relative flex-1 flex flex-col items-center -top-4">
            <a 
              href="#order"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/40 border-4 border-background"
            >
              <Sparkles className="h-6 w-6 text-white" />
            </a>
            <span className="text-[10px] font-bold text-primary mt-1.5 uppercase tracking-tighter">Pesan</span>
          </div>

          <Link 
            href="/affiliate" 
            className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${pathname === '/affiliate' ? 'text-emerald-500' : 'text-muted-foreground'}`}
          >
            <Users className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">Affiliate</span>
          </Link>

          <button 
            className="flex flex-col items-center justify-center flex-1 gap-1 text-muted-foreground"
            onClick={() => {
              // Trigger the existing mobile menu in Header if possible, 
              // but for now let's just scroll to footer or top
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">Menu</span>
          </button>

        </div>
      </div>
    </div>
  );
}

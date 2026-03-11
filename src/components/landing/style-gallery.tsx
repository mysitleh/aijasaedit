"use client";

import { Camera, Sparkles } from "lucide-react";
import Image from "next/image";

const stylesRow1 = [
  { name: "Monokrom", img: "/styles/monokrom.png" },
  { name: "Blok warna", img: "/styles/blok-warna.png" },
  { name: "Runway", img: "/styles/runway.png" },
  { name: "Risograf", img: "/styles/risograf.png" },
  { name: "Technicolor", img: "/styles/technicolor.png" },
  { name: "Tanah liat gotik", img: "/styles/tanah-liat-gotik.png" },
  { name: "Sketsa", img: "/styles/sketsa.png" },
  { name: "Sinematik", img: "/styles/sinematik.png" },
  { name: "Steampunk", img: "/styles/steampunk.png" },
  { name: "Matahari terbit", img: "/styles/matahari-terbit.png" },
  { name: "Seni AI", img: "/styles/seni-ai.png" },
  { name: "Dunia Vaporwave", img: "/styles/vaporwave.png" },
  { name: "Potret Glitch", img: "/styles/potret-glitch.png" },
  { name: "Y2K Aesthetic", img: "/styles/y2k.png" },
];

const stylesRow2 = [
  { name: "Dinamit", img: "/styles/dinamit.png" },
  { name: "Salon", img: "/styles/salon.png" },
  { name: "Papyrus Mesir", img: "/styles/papyrus.png" },
  { name: "Mozaik Kaca Romawi", img: "/styles/mozaik.png" },
  { name: "Kustom Vektorial", img: "/styles/vektorial.png" },
  { name: "Seni Jalaan Graffiti", img: "/styles/graffiti.png" },
  { name: "Petarung mitos", img: "/styles/petarung-mitos.png" },
  { name: "Surealis", img: "/styles/surealis.png" },
  { name: "Pin enamel", img: "/styles/pin-enamel.png" },
  { name: "Cyborg", img: "/styles/cyborg.png" },
  { name: "Potret halus", img: "/styles/potret-halus.png" },
  { name: "Kartun lama", img: "/styles/kartun-lama.png" },
  { name: "Lukisan minyak", img: "/styles/lukisan-minyak.png" },
  { name: "Anime", img: "/styles/anime.png" },
];

type StyleItem = { name: string; img: string };

function StyleCard({ name, img }: StyleItem) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-1.5 group active:scale-95 transition-transform duration-150">
      <div className="w-[110px] h-[140px] sm:w-[130px] sm:h-[165px] rounded-2xl shadow-lg ring-2 ring-transparent group-hover:ring-primary/60 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/20 overflow-hidden relative">
        <Image
          src={img}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="130px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
        <div className="absolute top-1.5 right-1.5">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/30 text-white backdrop-blur-sm">
            AI
          </span>
        </div>
        <div className="absolute bottom-2 left-0 right-0 px-1.5">
          <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md truncate block text-center bg-black/40 text-white backdrop-blur-sm">
            {name}
          </span>
        </div>
      </div>
      <span className="text-[11px] font-medium text-muted-foreground text-center leading-tight max-w-[120px] truncate group-hover:text-foreground transition-colors">
        {name}
      </span>
    </div>
  );
}

const StyleGallery = () => {
  return (
    <section id="gaya" className="w-full py-8 md:py-16 animate-fade-in-up overflow-hidden" style={{ animationDelay: "0.35s" }}>
      <div className="px-4 md:px-8 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs font-mono text-muted-foreground bg-secondary/70 border border-border px-2 py-0.5 rounded-md">v0.01</span>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight font-headline text-foreground">Pilihan Gaya AI</h2>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Pilih dari puluhan gaya artistik eksklusif</p>
            </div>
          </div>
          <button className="p-2 rounded-full bg-secondary/60 hover:bg-secondary border border-border transition-colors text-muted-foreground hover:text-foreground touch-manipulation">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div
            className="flex gap-2.5 md:gap-3 pb-3 scroll-x-snap"
            style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {stylesRow1.map((style) => (
              <StyleCard key={style.name} {...style} />
            ))}
          </div>
          <div
            className="flex gap-2.5 md:gap-3 pb-3 scroll-x-snap"
            style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {stylesRow2.map((style) => (
              <StyleCard key={style.name} {...style} />
            ))}
          </div>
        </div>

        <div className="mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {[
            { src: "/style-gallery-1.png", label: "Koleksi Gaya Modern" },
            { src: "/style-gallery-2.png", label: "Gaya Historis & Artistik" },
            { src: "/style-gallery-3.png", label: "Semua Gaya Tersedia" },
          ].map((item, i) => (
            <div key={i} className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 group cursor-pointer">
              <img src={item.src} alt={item.label} className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-xs font-semibold text-white">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleGallery;

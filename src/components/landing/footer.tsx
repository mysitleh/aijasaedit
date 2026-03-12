import { Sparkles } from "lucide-react";
import Link from "next/link";
import Logo from "../icons/logo";

const Footer = () => {
  return (
    <footer className="w-full bg-background/90 border-t safe-bottom">
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 mb-8">
          <div className="flex flex-col gap-3">
            <a href="#" className="flex items-center gap-2">
              <Logo className="h-6 w-auto" />
            </a>
            <p className="text-sm text-muted-foreground max-w-xs">
              Layanan edit foto dan video berbasis AI terdepan di Indonesia. Wujudkan kreasi terbaik Anda.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Navigasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#gaya" className="hover:text-primary transition-colors">Pilihan Gaya</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Layanan</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">Cara Kerja &amp; Harga</a></li>
              <li><a href="#showcase" className="hover:text-primary transition-colors">Galeri Karya</a></li>
              <li><a href="#order" className="hover:text-primary transition-colors">Pesan Sekarang</a></li>
              <li><Link href="/affiliate" className="hover:text-primary transition-colors font-medium text-emerald-500/80">🎁 Program Affiliate</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Hubungi Kami</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>WhatsApp: <a href="tel:+628123456789" className="hover:text-primary transition-colors">0812-3456-7890</a></li>
              <li>Email: <a href="mailto:halo@aijasaedit.id" className="hover:text-primary transition-colors">halo@aijasaedit.id</a></li>
            </ul>
            <div className="flex items-center gap-1 mt-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs text-muted-foreground">Respon dalam &lt; 1 jam</span>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} AI Jasa Edit. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              Dibuat dengan <span className="text-primary">♥</span> dan AI
            </p>
            <span className="text-muted-foreground/20">|</span>
            <a 
              href="/admin" 
              className="text-[10px] text-muted-foreground/30 hover:text-primary transition-colors hover:underline underline-offset-4"
            >
              Staff Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

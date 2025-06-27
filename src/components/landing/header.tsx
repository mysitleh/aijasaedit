import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "../icons/logo";
import { Sparkles, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="#" className="flex items-center justify-center">
          <Logo className="h-6 w-auto" />
          <span className="sr-only">AI Jasa Edit</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-4 md:gap-6">
          <Link href="#services" className="text-sm font-medium hover:underline underline-offset-4">
            Layanan
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
            Harga
          </Link>
          <Link href="#showcase" className="text-sm font-medium hover:underline underline-offset-4">
            Galeri
          </Link>
        </nav>
        <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
                <ThemeToggle />
                <Button asChild>
                    <Link href="#order">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Pesan Sekarang
                    </Link>
                </Button>
            </div>
            
            <div className="sm:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Buka menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                      <nav className="grid gap-6 text-lg font-medium mt-8">
                          <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                              <Logo className="h-6 w-auto" />
                          </Link>
                          <Link href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
                          Layanan
                          </Link>
                          <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                          Harga
                          </Link>
                          <Link href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">
                          Galeri
                          </Link>
                      </nav>
                      <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-4">
                          <ThemeToggle />
                          <Button asChild size="lg">
                              <Link href="#order">
                              <Sparkles className="mr-2 h-5 w-5" />
                              Pesan Sekarang
                              </Link>
                          </Button>
                      </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

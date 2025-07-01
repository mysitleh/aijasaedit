import { Button } from "@/components/ui/button";
import Logo from "../icons/logo";
import { Sparkles, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <a href="#" className="flex items-center justify-center">
          <Logo className="h-6 w-auto" />
          <span className="sr-only">AI Jasa Edit</span>
        </a>
        <nav className="hidden sm:flex items-center gap-4 md:gap-6">
          <a href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </a>
          <a href="#services" className="text-sm font-medium hover:underline underline-offset-4">
            Layanan
          </a>
          <a href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
            Harga
          </a>
          <a href="#showcase" className="text-sm font-medium hover:underline underline-offset-4">
            Galeri
          </a>
        </nav>
        <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
                <ThemeToggle />
                <Button asChild>
                    <a href="#order">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Pesan Sekarang
                    </a>
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
                    <SheetContent side="top" className="w-full h-auto bg-background/95 backdrop-blur-sm pt-24 pb-12 data-[state=open]:duration-200 data-[state=closed]:duration-200">
                      <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                      <nav className="flex flex-col items-center gap-6 text-xl font-medium">
                          <SheetClose asChild>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                              Home
                            </a>
                          </SheetClose>
                          <SheetClose asChild>
                            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
                              Layanan
                            </a>
                          </SheetClose>
                          <SheetClose asChild>
                            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                              Harga
                            </a>
                          </SheetClose>
                          <SheetClose asChild>
                            <a href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">
                              Galeri
                            </a>
                          </SheetClose>
                          <div className="flex items-center gap-4 pt-6">
                            <ThemeToggle />
                            <SheetClose asChild>
                              <Button asChild size="lg">
                                  <a href="#order">
                                  <Sparkles className="mr-2 h-5 w-5" />
                                  Pesan Sekarang
                                  </a>
                              </Button>
                            </SheetClose>
                          </div>
                      </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

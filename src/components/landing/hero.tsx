import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MoveRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full pt-10 pb-12 md:pt-16 md:pb-20 lg:py-28 xl:py-36 animate-fade-in-up">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_540px] gap-8 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-5 text-center lg:text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary mx-auto lg:mx-0">
                <Sparkles className="h-3 w-3" />
                Didukung oleh AI Generatif
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none font-headline text-primary-foreground leading-tight">
                Transformasi Ajaib untuk{" "}
                <span className="text-primary">Foto & Video</span> Anda
              </h1>
              <p className="max-w-[560px] text-muted-foreground text-base md:text-lg mx-auto lg:mx-0">
                Wujudkan imajinasi terliar Anda bersama AI Jasa Edit. Ubah foto biasa menjadi karya seni luar biasa — semua dengan sentuhan keajaiban AI.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button asChild size="lg" className="h-12 px-6 text-base rounded-xl w-full sm:w-auto">
                <Link href="#order">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Mulai Proyek Anda
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base rounded-xl w-full sm:w-auto">
                <Link href="#gaya">
                  Lihat Gaya AI
                  <MoveRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">50+</p>
                <p className="text-xs text-muted-foreground">Gaya AI</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">24h</p>
                <p className="text-xs text-muted-foreground">Pengiriman</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-xs text-muted-foreground">Kepuasan</p>
              </div>
            </div>
          </div>
          <div className="w-full max-w-sm mx-auto lg:max-w-none lg:order-last">
            <Image
              src="/hero-image.png"
              data-ai-hint="elegant tech lines"
              alt="AI Transformation Hero Image"
              width={540}
              height={540}
              priority
              className="w-full aspect-square overflow-hidden rounded-2xl object-cover shadow-2xl shadow-primary/20 animate-slow-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

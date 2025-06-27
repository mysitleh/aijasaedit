import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MoveRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 animate-fade-in-up">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary-foreground">
                Transformasi Ajaib untuk Foto & Video Anda
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Wujudkan imajinasi terliar Anda bersama AI Jasa Edit. Ubah foto biasa menjadi karya seni luar biasa, dan video impian menjadi kenyataan. Semua dengan sentuhan keajaiban AI.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="#order">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Mulai Proyek Anda
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#showcase">
                  Lihat Karya Kami
                  <MoveRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <Image
            src="https://placehold.co/600x600.png"
            data-ai-hint="elegant tech lines"
            alt="AI Transformation Hero Image"
            width={600}
            height={600}
            className="mx-auto aspect-square overflow-hidden rounded-xl object-cover shadow-2xl shadow-primary/20 sm:w-full lg:order-last animate-slow-float"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

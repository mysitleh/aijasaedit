import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const showcaseItems = [
  {
    before: { src: "/showcase/superhero-before.png", hint: "man portrait" },
    after: { src: "/showcase/superhero-after.png", hint: "man cinematic character" },
    title: "Dari Santai Jadi Pahlawan Super",
    description: "Mengubah swafoto menjadi poster film pahlawan super.",
  },
  {
    before: { src: "/showcase/cyberpunk-before.png", hint: "modern architecture" },
    after: { src: "/showcase/cyberpunk-after.png", hint: "futuristic cityscape" },
    title: "Jalan Kota Jadi Cyberpunk",
    description: "Mengubah pemandangan kota menjadi dunia cyberpunk yang futuristik.",
  },
  {
    before: { src: "/showcase/lukisan-before.png", hint: "woman profile" },
    after: { src: "/showcase/lukisan-after.png", hint: "woman renaissance painting" },
    title: "Potret Jadi Lukisan Klasik",
    description: "Menata ulang potret modern menjadi sebuah mahakarya klasik.",
  },
  {
    before: { src: "/showcase/kartun-before.png", hint: "dog portrait studio" },
    after: { src: "/showcase/kartun-after.png", hint: "animated dog character" },
    title: "Hewan Jadi Karakter Kartun",
    description: "Mengubah hewan peliharaan kesayangan menjadi karakter kartun yang menggemaskan.",
  },
];

const Showcase = () => {
  return (
    <section id="showcase" className="w-full py-12 md:py-20 lg:py-28 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-3 text-center mb-10 md:mb-14">
          <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
            Hasil Nyata
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-primary-foreground">
            Galeri Karya AI
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-sm md:text-base">
            Lihat keajaiban yang bisa diciptakan oleh AI kami. Geser untuk membandingkan sebelum dan sesudah.
          </p>
        </div>
        <div>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full max-w-3xl mx-auto"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {showcaseItems.map((item, index) => (
                <CarouselItem key={index} className="pl-3 md:pl-4">
                  <Card className="bg-card border border-border rounded-2xl overflow-hidden">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-base md:text-xl font-bold font-headline mb-1">{item.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-4">{item.description}</p>
                      <div className="grid grid-cols-2 gap-2 md:gap-4">
                        <div>
                          <p className="text-center text-xs md:text-sm font-semibold mb-2 text-muted-foreground">Sebelum</p>
                          <Image
                            src={item.before.src}
                            data-ai-hint={item.before.hint}
                            alt={`Sebelum - ${item.title}`}
                            width={400}
                            height={400}
                            className="aspect-square w-full rounded-xl object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-center text-xs md:text-sm font-semibold mb-2 text-primary">Sesudah (AI)</p>
                          <Image
                            src={item.after.src}
                            data-ai-hint={item.after.hint}
                            alt={`Sesudah - ${item.title}`}
                            width={400}
                            height={400}
                            className="aspect-square w-full rounded-xl object-cover ring-2 ring-primary"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-4" />
            <CarouselNext className="hidden sm:flex -right-4" />
          </Carousel>
          <div className="flex justify-center mt-4 sm:hidden">
            <p className="text-xs text-muted-foreground">← Geser untuk melihat lebih →</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;

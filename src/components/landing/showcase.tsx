import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const showcaseItems = [
  {
    before: { src: "https://placehold.co/600x400.png", hint: "man portrait" },
    after: { src: "https://placehold.co/600x400.png", hint: "man cinematic character" },
    title: "Dari Santai Jadi Pahlawan Super",
    description: "Mengubah swafoto menjadi poster film pahlawan super.",
  },
  {
    before: { src: "https://placehold.co/600x400.png", hint: "modern architecture" },
    after: { src: "https://placehold.co/600x400.png", hint: "futuristic cityscape" },
    title: "Jalan Kota Jadi Cyberpunk",
    description: "Mengubah pemandangan kota menjadi dunia cyberpunk yang futuristik.",
  },
  {
    before: { src: "https://placehold.co/600x400.png", hint: "woman profile" },
    after: { src: "https://placehold.co/600x400.png", hint: "woman renaissance painting" },
    title: "Potret Jadi Lukisan Klasik",
    description: "Menata ulang potret modern menjadi sebuah mahakarya klasik.",
  },
  {
    before: { src: "https://placehold.co/600x400.png", hint: "dog portrait studio" },
    after: { src: "https://placehold.co/600x400.png", hint: "animated dog character" },
    title: "Hewan Jadi Karakter Kartun",
    description: "Mengubah hewan peliharaan kesayangan menjadi karakter kartun yang menggemaskan.",
  },
];

const Showcase = () => {
  return (
    <section id="showcase" className="w-full py-12 md:py-24 lg:py-32 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary-foreground">Galeri Karya AI</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Lihat keajaiban yang bisa diciptakan oleh AI kami. Geser untuk membandingkan sebelum dan sesudah.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {showcaseItems.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/1">
                  <div className="p-1">
                    <Card className="bg-card">
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-xl font-bold font-headline">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-center font-semibold mb-2">Sebelum</p>
                            <Image
                              src={item.before.src}
                              data-ai-hint={item.before.hint}
                              alt={`Sebelum - ${item.title}`}
                              width={400}
                              height={400}
                              className="aspect-square w-full rounded-lg object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-center font-semibold mb-2 text-primary">Sesudah (AI)</p>
                            <Image
                              src={item.after.src}
                              data-ai-hint={item.after.hint}
                              alt={`Sesudah - ${item.title}`}
                              width={400}
                              height={400}
                              className="aspect-square w-full rounded-lg object-cover border-2 border-primary"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Showcase;

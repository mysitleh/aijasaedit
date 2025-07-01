import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { Service } from "@/app/actions";
import { renderIcon } from "@/components/icons/icon-map";

const Services = ({ services: fetchedServices }: { services: Service[] }) => {
  // Fallback to hardcoded data if fetching fails or returns nothing
  const services = fetchedServices.length > 0 ? fetchedServices : [
    {
      id: 'fallback-1',
      icon: 'Camera',
      title: 'Adegan Supercar',
      description: 'Posisikan diri Anda dalam adegan viral "diberhentikan polisi" dengan supercar mewah pilihan Anda.',
      image_placeholder: 'https://placehold.co/400x300.png',
      ai_hint: 'luxury car night',
      price: 'Rp 75.000',
      order: 1,
    },
    {
      id: 'fallback-2',
      icon: 'Video',
      title: 'Video Karir Masa Depan',
      description: "Lihat anak Anda sebagai astronot, ilmuwan, atau profesi impian lainnya dalam video sinematik singkat.",
      image_placeholder: 'https://placehold.co/400x300.png',
      ai_hint: 'child scientist cinematic',
      price: 'Rp 100.000',
      order: 2,
    },
    {
      id: 'fallback-3',
      icon: 'GraduationCap',
      title: 'Foto Wisuda AI',
      description: "Tidak sempat foto wisuda? Kami akan membuatkan foto yang profesional dan elegan untuk Anda.",
      image_placeholder: 'https://placehold.co/400x300.png',
      ai_hint: 'professional headshot',
      price: 'Rp 60.000',
      order: 3,
    },
    {
      id: 'fallback-4',
      icon: 'PawPrint',
      title: 'Hewan Peliharaan Jadi Kartun',
      description: 'Ubah foto hewan kesayangan Anda menjadi karakter kartun yang menggemaskan dan menawan.',
      image_placeholder: 'https://placehold.co/400x300.png',
      ai_hint: 'animated dog character',
      price: 'Rp 65.000',
      order: 4,
    },
    {
      id: 'fallback-5',
      icon: 'Rocket',
      title: 'Potret Fantasi & Pahlawan Super',
      description: 'Jadilah pahlawan super, ksatria dari dunia fantasi, atau penjelajah luar angkasa.',
      image_placeholder: 'https://placehold.co/400x300.png',
      ai_hint: 'man cinematic character',
      price: 'Rp 85.000',
      order: 5,
    },
    {
      id: 'fallback-6',
      icon: 'Sparkles',
      title: 'Edit AI Kustom',
      description: 'Punya ide kreatif lain? Beri tahu kami, dan AI kami akan mewujudkannya.',
      image_placeholder: 'https://placehold.co/400x300.png',
      ai_hint: 'glowing particles',
      price: 'Hubungi Kami',
      order: 6,
    },
  ];

  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-background/80 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Layanan Unggulan</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary-foreground">Kreasi Tanpa Batas dengan AI</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Kami menawarkan berbagai layanan edit foto dan video unik dan tren yang didukung oleh AI.
            </p>
          </div>
        </div>
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl md:gap-12 lg:max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {services.map((service) => (
            <Card key={service.id} className="group h-full flex flex-col bg-card hover:bg-secondary/60 transition-colors duration-300">
              <CardHeader className="items-center">
                <div className="transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-rotate-12">
                  {renderIcon(service.icon, { className: "h-8 w-8 text-accent" })}
                </div>
                <CardTitle className="mt-4 text-center">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between text-center">
                <CardDescription>{service.description}</CardDescription>
                <div className="mt-4">
                  <Image 
                    src={service.image_placeholder} 
                    alt={service.title} 
                    width={400} 
                    height={300} 
                    data-ai-hint={service.ai_hint}
                    className="rounded-lg aspect-[4/3] object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

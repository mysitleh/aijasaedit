import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { Service } from "@/app/actions";
import { renderIcon } from "@/components/icons/icon-map";

const Services = ({ services: fetchedServices }: { services: Service[] }) => {
  const services = fetchedServices.length > 0 ? fetchedServices : [
    { id: 'f1', icon: 'Camera', title: 'Adegan Supercar', description: 'Posisikan diri Anda dalam adegan viral "diberhentikan polisi" dengan supercar mewah pilihan Anda.', image_placeholder: '/services/supercar.webp', ai_hint: 'luxury car night', price: 'Rp 75.000', order: 1 },
    { id: 'f2', icon: 'Video', title: 'Video Karir Masa Depan', description: "Lihat anak Anda sebagai astronot, ilmuwan, atau profesi impian lainnya dalam video sinematik singkat.", image_placeholder: '/services/astronaut.webp', ai_hint: 'child scientist cinematic', price: 'Rp 100.000', order: 2 },
    { id: 'f3', icon: 'GraduationCap', title: 'Foto Wisuda AI', description: "Tidak sempat foto wisuda? Kami akan membuatkan foto yang profesional dan elegan untuk Anda.", image_placeholder: '/services/wisuda.webp', ai_hint: 'professional headshot', price: 'Rp 60.000', order: 3 },
    { id: 'f4', icon: 'PawPrint', title: 'Hewan Peliharaan Jadi Kartun', description: 'Ubah foto hewan kesayangan Anda menjadi karakter kartun yang menggemaskan dan menawan.', image_placeholder: '/services/cartoon-pet.webp', ai_hint: 'animated dog character', price: 'Rp 65.000', order: 4 },
    { id: 'f5', icon: 'Rocket', title: 'Potret Fantasi & Pahlawan Super', description: 'Jadilah pahlawan super, ksatria dari dunia fantasi, atau penjelajah luar angkasa.', image_placeholder: '/services/superhero.webp', ai_hint: 'man cinematic character', price: 'Rp 85.000', order: 5 },
    { id: 'f6', icon: 'Sparkles', title: 'Edit AI Kustom', description: 'Punya ide kreatif lain? Beri tahu kami, dan AI kami akan mewujudkannya.', image_placeholder: '/services/custom-ai.webp', ai_hint: 'glowing particles', price: 'Hubungi Kami', order: 6 },
  ];

  return (
    <section id="services" className="w-full py-12 md:py-20 lg:py-28 bg-background/80 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-3 text-center mb-10 md:mb-14">
          <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
            Layanan Unggulan
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-primary-foreground">
            Kreasi Tanpa Batas dengan AI
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-sm md:text-base lg:text-lg">
            Kami menawarkan berbagai layanan edit foto dan video unik yang didukung oleh AI.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service) => (
            <Card key={service.id} className="group flex flex-col bg-card hover:bg-secondary/40 transition-all duration-300 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 rounded-2xl overflow-hidden">
              <div className="relative overflow-hidden">
                <Image
                  src={service.image_placeholder}
                  alt={service.title}
                  width={400}
                  height={220}
                  data-ai-hint={service.ai_hint}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border">
                    {renderIcon(service.icon, { className: "h-4 w-4 text-accent" })}
                  </div>
                  <span className="text-xs font-bold text-white bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {service.price}
                  </span>
                </div>
              </div>
              <CardContent className="flex-1 flex flex-col p-4 md:p-5">
                <h3 className="text-base font-semibold text-foreground mb-1.5 line-clamp-1">{service.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

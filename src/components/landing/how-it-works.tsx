import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, Download } from "lucide-react";
import type { Service } from "@/app/actions";
import { renderIcon } from "@/components/icons/icon-map";

const steps = [
  {
    icon: <FileText className="h-7 w-7 text-accent" />,
    title: "1. Isi Formulir",
    description: "Pilih layanan, unggah file Anda, dan berikan deskripsi singkat tentang editan yang Anda inginkan.",
  },
  {
    icon: <Sparkles className="h-7 w-7 text-accent" />,
    title: "2. Keajaiban AI Bekerja",
    description: "AI canggih kami akan memproses permintaan Anda dan menghasilkan beberapa pilihan editan yang menakjubkan.",
  },
  {
    icon: <Download className="h-7 w-7 text-accent" />,
    title: "3. Terima Hasilnya",
    description: "Anda akan menerima hasilnya dalam 24 jam. Pilih favorit Anda dan hubungi kami untuk permintaan lebih lanjut.",
  },
];

const HowItWorks = ({ services }: { services: Service[] }) => {
  const prices = services.length > 0 ? services : [
    { id: 'f1', icon: 'Car', title: 'Adegan Supercar', price: 'Rp 75.000', order: 1, description: '', image_placeholder: '', ai_hint: '' },
    { id: 'f2', icon: 'Briefcase', title: 'Video Karir Masa Depan', price: 'Rp 100.000', order: 2, description: '', image_placeholder: '', ai_hint: '' },
    { id: 'f3', icon: 'GraduationCap', title: 'Foto Wisuda AI', price: 'Rp 60.000', order: 3, description: '', image_placeholder: '', ai_hint: '' },
    { id: 'f4', icon: 'PawPrint', title: 'Hewan Peliharaan Jadi Kartun', price: 'Rp 65.000', order: 4, description: '', image_placeholder: '', ai_hint: '' },
    { id: 'f5', icon: 'Rocket', title: 'Potret Fantasi', price: 'Rp 85.000', order: 5, description: '', image_placeholder: '', ai_hint: '' },
    { id: 'f6', icon: 'Wand2', title: 'Edit AI Kustom', price: 'Hubungi Kami', order: 6, description: '', image_placeholder: '', ai_hint: '' },
  ];

  return (
    <section id="how-it-works" className="w-full py-12 md:py-20 lg:py-28 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-3 text-center mb-10 md:mb-14">
          <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
            Transparan & Sederhana
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-primary-foreground">
            Cara Kerja & Harga
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-sm md:text-base">
            Lihat betapa mudahnya mendapatkan editan impian Anda dan berapa biayanya.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12 md:mb-20">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-8 font-headline">Cara Kerja</h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="group flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center p-4 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors duration-300">
                <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/60 border border-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {step.icon}
                </div>
                <div className="flex-1 md:mt-4">
                  <h4 className="text-sm md:text-base font-semibold mb-1">{step.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-8 font-headline">Daftar Harga</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {prices.map((item) => (
              <Card key={item.id} className="group overflow-hidden text-center bg-card hover:bg-secondary/40 transition-all duration-300 border border-border hover:border-primary/30 rounded-2xl flex flex-col">
                <div className="relative w-full h-32 sm:h-40 overflow-hidden bg-muted">
                  {item.image_placeholder ? (
                    <img 
                      src={item.image_placeholder} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/60">
                      {renderIcon(item.icon, { className: 'h-10 w-10 text-primary/50' })}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
                </div>
                
                <CardHeader className="items-center pb-2 pt-2 px-3 md:px-6 relative z-10 -mt-6">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-background border border-border shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:border-primary/50 group-hover:shadow-primary/20">
                    {renderIcon(item.icon, { className: 'h-5 w-5 md:h-6 md:w-6 text-primary' })}
                  </div>
                  <CardTitle className="mt-2 text-sm md:text-base font-bold leading-tight line-clamp-2 px-0 text-foreground">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-4 md:px-6 md:pb-6 mt-auto">
                  <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm md:text-base font-bold text-primary">
                    {item.price}
                  </p>
                  {item.price === 'Hubungi Kami' && (
                    <p className="text-xs text-muted-foreground mt-2 hidden sm:block">Untuk kebutuhan unik Anda</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6 md:mt-8">
            <p className="text-sm text-muted-foreground">
              Punya pertanyaan?{" "}
              <a href="#order" className="text-primary hover:underline font-medium">Hubungi kami sekarang</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

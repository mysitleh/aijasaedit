import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, Download, Car, Briefcase, GraduationCap, Wand2, Phone, PawPrint, Rocket } from "lucide-react";

const steps = [
  {
    icon: <FileText className="h-10 w-10 text-accent" />,
    title: "1. Isi Formulir",
    description: "Pilih layanan, unggah file Anda, dan berikan deskripsi singkat tentang editan yang Anda inginkan.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-accent" />,
    title: "2. Keajaiban AI Bekerja",
    description: "AI canggih kami akan memproses permintaan Anda dan menghasilkan beberapa pilihan editan yang menakjubkan.",
  },
  {
    icon: <Download className="h-10 w-10 text-accent" />,
    title: "3. Terima Hasilnya",
    description: "Anda akan langsung melihat hasilnya di layar. Pilih favorit Anda dan hubungi kami untuk permintaan lebih lanjut.",
  },
];

const prices = [
    {
      icon: <Car className="h-8 w-8 text-primary" />,
      title: 'Adegan Supercar',
      price: 'Rp 75.000',
    },
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: 'Video Karir Masa Depan',
      price: 'Rp 100.000',
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: 'Foto Wisuda AI',
      price: 'Rp 60.000',
    },
    {
      icon: <PawPrint className="h-8 w-8 text-primary" />,
      title: 'Hewan Peliharaan Jadi Kartun',
      price: 'Rp 65.000',
    },
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: 'Potret Fantasi',
      price: 'Rp 85.000',
    },
    {
      icon: <Wand2 className="h-8 w-8 text-primary" />,
      title: 'Edit AI Kustom',
      price: 'Hubungi Kami',
    },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary-foreground">Transparan & Sederhana</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Lihat betapa mudahnya mendapatkan editan impian Anda dan berapa biayanya.
            </p>
          </div>
        </div>
        
        <div className="mx-auto max-w-5xl mt-12">
            <h3 className="text-2xl font-bold text-center mb-8 font-headline">Cara Kerja</h3>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={index} className="group flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/60 mb-4 border border-primary/20 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-12">
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
        </div>

        <div className="mx-auto max-w-5xl mt-20">
            <h3 className="text-2xl font-bold text-center mb-8 font-headline">Daftar Harga</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {prices.map((item, index) => (
                <Card key={index} className="group text-center bg-card hover:bg-secondary/60 transition-colors duration-300">
                  <CardHeader className="items-center">
                    <div className="transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-12">
                      {item.icon}
                    </div>
                    <CardTitle className="mt-4">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">{item.price}</p>
                    {item.price === 'Hubungi Kami' && (
                        <p className="text-xs text-muted-foreground mt-1">Untuk kebutuhan unik Anda</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
             <div className="text-center mt-8">
                <p className="text-muted-foreground">Punya pertanyaan lain? Jangan ragu untuk <a href="#order" className="text-primary hover:underline">menghubungi kami</a>.</p>
            </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;

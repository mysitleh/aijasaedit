import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqJsonLd } from "@/components/seo/json-ld";

export const FAQ_ITEMS = [
  {
    q: "Berapa lama proses edit foto atau video saya?",
    a: "Hasil editan dikirimkan dalam 1×24 jam setelah pembayaran dikonfirmasi. Untuk pesanan yang masuk sebelum pukul 18.00 WIB, biasanya selesai di hari yang sama.",
  },
  {
    q: "Format file apa yang bisa saya kirimkan?",
    a: "Kami menerima semua format gambar umum (JPG, PNG, WEBP, HEIC) dan video (MP4, MOV, AVI). Ukuran file maksimal 15MB per pengiriman.",
  },
  {
    q: "Apakah ada revisi gratis?",
    a: "Ya, setiap pesanan sudah termasuk 1 kali revisi gratis. Jika hasil tidak sesuai dengan deskripsi yang Anda berikan, kami akan perbaiki tanpa biaya tambahan.",
  },
  {
    q: "Bagaimana cara melakukan pembayaran?",
    a: "Kami menerima transfer bank BCA dan semua e-wallet melalui QRIS (GoPay, OVO, Dana, ShopeePay). Setelah bayar, kirimkan bukti transfer + foto/video Anda ke WhatsApp kami.",
  },
  {
    q: "Apakah foto saya aman dan dijaga kerahasiaannya?",
    a: "Sangat aman. File Anda hanya digunakan untuk keperluan editan dan tidak akan disebarkan, dijual, atau digunakan untuk keperluan lain. Kami menghapus file dari server setelah hasil dikirimkan.",
  },
  {
    q: "Bisakah saya minta gaya atau konsep yang tidak ada di daftar layanan?",
    a: "Tentu! Pilih layanan \u2018Edit AI Kustom\u2019 dan jelaskan konsep Anda di kolom deskripsi. Tim kami akan menghubungi Anda melalui WhatsApp untuk mendiskusikan detail dan harga.",
  },
  {
    q: "Apakah bisa memesan lebih dari satu foto sekaligus?",
    a: "Bisa. Kirimkan semua file Anda dalam satu pesan WhatsApp. Untuk pemesanan lebih dari 3 foto, kami memberikan diskon khusus — tanyakan langsung ke WhatsApp kami untuk penawaran terbaik.",
  },
  {
    q: "Apakah hasil editan bisa digunakan untuk keperluan komersial?",
    a: "Ya, hasil editan sepenuhnya menjadi milik Anda dan bebas digunakan untuk keperluan pribadi maupun komersial (media sosial, promosi, dll) tanpa biaya lisensi tambahan.",
  },
];

const FaqSection = () => {
  return (
    <section
      id="faq"
      className="w-full py-12 md:py-20 lg:py-28 bg-background/80 animate-fade-in-up"
      style={{ animationDelay: "0.5s" }}
    >
      <FaqJsonLd faqs={FAQ_ITEMS} />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-3 text-center mb-10 md:mb-14">
          <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
            Pertanyaan Umum
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-primary-foreground">
            Ada Pertanyaan?
          </h2>
          <p className="max-w-[600px] text-muted-foreground text-sm md:text-base">
            Jawaban lengkap untuk hal-hal yang sering ditanyakan sebelum memesan.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-xl px-5 bg-card hover:border-primary/30 transition-colors duration-200"
              >
                <AccordionTrigger className="text-left text-sm md:text-base font-medium py-4 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Masih ada pertanyaan lain?{" "}
            <a
              href={`https://wa.me/6281234567890`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              Tanya langsung via WhatsApp →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

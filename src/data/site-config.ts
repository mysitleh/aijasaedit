export const SITE_CONFIG = {
  whatsapp: {
    number: "6281234567890",
    display: "0812-3456-7890",
  },
  payment: {
    bank: {
      name: "BCA (Bank Central Asia)",
      account: "1234-5678-90",
      holder: "PT Jasa Edit AI",
    },
    qris: {
      image: "/qris-payment.webp",
    },
    notes: [
      "Setelah transfer, kirim bukti bayar ke WhatsApp kami.",
      "Hasil editan dikirim dalam 1×24 jam setelah pembayaran dikonfirmasi.",
      "Revisi 1× gratis bila hasil tidak sesuai deskripsi.",
    ],
  },
};

export const HARDCODED_SERVICES = [
  {
    id: "f1",
    icon: "Camera",
    title: "Adegan Supercar",
    description: "Posisikan diri Anda dalam adegan viral supercar mewah pilihan Anda.",
    image_placeholder: "/services/supercar.webp",
    ai_hint: "luxury car night",
    price: "Rp 75.000",
    order: 1,
  },
  {
    id: "f2",
    icon: "Video",
    title: "Video Karir Masa Depan",
    description: "Lihat anak Anda sebagai astronot, ilmuwan, atau profesi impian lainnya.",
    image_placeholder: "/services/astronaut.webp",
    ai_hint: "child scientist cinematic",
    price: "Rp 100.000",
    order: 2,
  },
  {
    id: "f3",
    icon: "GraduationCap",
    title: "Foto Wisuda AI",
    description: "Kami buatkan foto wisuda profesional dan elegan untuk Anda.",
    image_placeholder: "/services/wisuda.webp",
    ai_hint: "professional headshot",
    price: "Rp 60.000",
    order: 3,
  },
  {
    id: "f4",
    icon: "PawPrint",
    title: "Hewan Peliharaan Jadi Kartun",
    description: "Ubah foto hewan kesayangan menjadi karakter kartun yang menggemaskan.",
    image_placeholder: "/services/cartoon-pet.webp",
    ai_hint: "animated dog character",
    price: "Rp 65.000",
    order: 4,
  },
  {
    id: "f5",
    icon: "Rocket",
    title: "Potret Fantasi & Pahlawan Super",
    description: "Jadilah pahlawan super, ksatria fantasi, atau penjelajah luar angkasa.",
    image_placeholder: "/services/superhero.webp",
    ai_hint: "man cinematic character",
    price: "Rp 85.000",
    order: 5,
  },
  {
    id: "f6",
    icon: "Sparkles",
    title: "Edit AI Kustom",
    description: "Punya ide kreatif lain? Beri tahu kami dan kami wujudkan.",
    image_placeholder: "/services/custom-ai.webp",
    ai_hint: "glowing particles",
    price: "Hubungi Kami",
    order: 6,
  },
];

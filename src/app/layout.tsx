import type {Metadata} from 'next';
import { Poppins } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import CustomCursor from '@/components/ui/custom-cursor';
import { ThemeProvider } from '@/components/theme-provider';
import ScrollToTopButton from '@/components/landing/scroll-to-top-button';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-poppins' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'AI Jasa Edit - Layanan Edit Foto & Video Berbasis AI',
  description: 'Ubah foto dan video Anda dengan kekuatan AI. Ciptakan visual yang memukau dengan mudah bersama AI Jasa Edit.',
  openGraph: {
    title: 'AI Jasa Edit - Transformasi Foto & Video dengan AI',
    description: 'Wujudkan imajinasi Anda. Kami mengubah foto dan video biasa menjadi karya seni luar biasa dengan sentuhan keajaiban AI.',
    url: siteUrl,
    siteName: 'AI Jasa Edit',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'AI Jasa Edit - Transformasi Ajaib untuk Foto & Video Anda',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Jasa Edit - Transformasi Foto & Video dengan AI',
    description: 'Wujudkan imajinasi Anda. Kami mengubah foto dan video biasa menjadi karya seni luar biasa dengan sentuhan keajaiban AI.',
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${poppins.variable} font-body antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            <CustomCursor />
            {children}
            <Toaster />
            <ScrollToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

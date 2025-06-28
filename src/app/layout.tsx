import type {Metadata} from 'next';
import { Poppins } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import CustomCursor from '@/components/ui/custom-cursor';
import { ThemeProvider } from '@/components/theme-provider';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-poppins' })

export const metadata: Metadata = {
  title: 'AI Jasa Edit - Layanan Edit Foto & Video Berbasis AI',
  description: 'Ubah foto dan video Anda dengan kekuatan AI. Ciptakan visual yang memukau dengan mudah bersama AI Jasa Edit.',
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
    enableSystem
>
            <CustomCursor />
            {children}
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

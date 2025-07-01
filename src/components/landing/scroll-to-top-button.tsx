'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Button
      size="icon"
      variant="default"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110',
        isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      )}
      aria-label="Kembali ke atas"
    >
      <ArrowUp className="h-6 w-6" />
      <span className="sr-only">Kembali ke atas</span>
    </Button>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Download, Smartphone } from "lucide-react";
import Logo from "@/components/icons/logo";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    // Check if dismissed recently (24h cooldown)
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < 24 * 60 * 60 * 1000) return;
    }

    // Detect iOS
    const ua = navigator.userAgent;
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // For Android/Chrome — listen for the native prompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 2500);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // For iOS — show custom guide after delay
    if (isIOSDevice) {
      setTimeout(() => setShowBanner(true), 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // Don't render anything if already standalone or nothing to show
  if (isStandalone || !showBanner) return null;

  // iOS Guide Modal
  if (isIOS && showIOSGuide) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleDismiss}
        />
        <div className="relative w-full max-w-sm mx-4 mb-6 sm:mb-0 rounded-2xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <Logo className="h-5 w-auto" />
              <span className="text-sm font-bold">Install AI Jasa Edit</span>
            </div>
            <button
              onClick={handleDismiss}
              className="h-7 w-7 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Untuk menginstall di iPhone/iPad:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                  1
                </span>
                <p className="text-sm">
                  Tap ikon{" "}
                  <span className="inline-flex items-center gap-0.5 bg-muted rounded px-1.5 py-0.5">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <span className="text-xs font-medium">Share</span>
                  </span>{" "}
                  di Safari
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                  2
                </span>
                <p className="text-sm">
                  Scroll dan tap{" "}
                  <span className="font-semibold">&quot;Add to Home Screen&quot;</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                  3
                </span>
                <p className="text-sm">
                  Tap <span className="font-semibold">&quot;Add&quot;</span> untuk menyelesaikan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Banner (Android & iOS)
  return (
    <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[90] sm:w-[360px] animate-slide-up">
      <div className="relative rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-primary to-cyan-500" />

        <div className="p-4 pt-5">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 h-6 w-6 flex items-center justify-center rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>

          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 flex-shrink-0">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold mb-0.5">Install AI Jasa Edit</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Akses lebih cepat langsung dari homescreen — tanpa unduh di Play
                Store!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleDismiss}
              className="flex-1 h-10 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border border-border/50"
            >
              Nanti
            </button>
            <button
              onClick={isIOS ? () => setShowIOSGuide(true) : handleInstall}
              className="flex-1 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-purple-500/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

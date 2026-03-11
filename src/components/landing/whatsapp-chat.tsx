"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/data/site-config";
import Image from "next/image";

const WA_MESSAGE = encodeURIComponent(
  "Halo AI Jasa Edit! 👋 Saya tertarik dengan layanan edit foto/video AI. Boleh saya tanya-tanya dulu?"
);

const WA_URL = `https://wa.me/${SITE_CONFIG.whatsapp.number}?text=${WA_MESSAGE}`;

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!isVisible || hasAutoOpened) return;
    const autoTimer = setTimeout(() => {
      setIsOpen(true);
      setHasAutoOpened(true);
      setShowPulse(false);
    }, 3500);
    return () => clearTimeout(autoTimer);
  }, [isVisible, hasAutoOpened]);

  const handleOpen = () => {
    setIsOpen(true);
    setShowPulse(false);
  };

  const handleClose = () => setIsOpen(false);

  const handleStartChat = () => {
    window.open(WA_URL, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {isOpen && (
        <div className="w-[290px] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden border border-white/10 animate-fade-in-up">
          <div
            style={{ background: "linear-gradient(135deg, #075e54, #128c7e)" }}
            className="flex items-center gap-3 px-4 py-3.5"
          >
            <div className="relative">
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/30 bg-white/10">
                <Image
                  src="/logo-icon.png"
                  alt="AI Jasa Edit"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-[#075e54]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-tight">AI Jasa Edit</p>
              <p className="text-[11px] text-green-200">● Online — biasanya membalas cepat</p>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-[#ece5dd] dark:bg-[#1a1a2e] px-4 py-5 space-y-3">
            <div className="flex items-end gap-2 max-w-[220px]">
              <div className="h-7 w-7 flex-shrink-0 rounded-full overflow-hidden">
                <Image
                  src="/logo-icon.png"
                  alt=""
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
              <div className="bg-white dark:bg-[#2a2a45] rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
                <p className="text-[13px] text-gray-800 dark:text-gray-200 leading-snug">
                  Halo! 👋 Ada yang bisa kami bantu?
                </p>
                <p className="text-[11px] text-gray-400 mt-1 text-right">Sekarang</p>
              </div>
            </div>

            <div className="flex items-end gap-2 max-w-[220px]">
              <div className="h-7 w-7 flex-shrink-0 rounded-full overflow-hidden opacity-0" />
              <div className="bg-white dark:bg-[#2a2a45] rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
                <p className="text-[13px] text-gray-800 dark:text-gray-200 leading-snug">
                  Tanya soal layanan, harga, atau langsung pesan — kami siap! 🎨✨
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f0f0f0] dark:bg-[#12122a] px-4 py-3">
            <button
              onClick={handleStartChat}
              style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Mulai Chat di WhatsApp
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        {showPulse && !isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-green-500 opacity-60 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping [animation-delay:0.3s]" />
          </>
        )}

        {!isOpen && (
          <div className="absolute -top-1 -right-1 z-10">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow">
              1
            </span>
          </div>
        )}

        <button
          onClick={isOpen ? handleClose : handleOpen}
          aria-label="Chat via WhatsApp"
          style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}
          className="relative h-14 w-14 rounded-full shadow-xl shadow-green-900/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="h-7 w-7"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

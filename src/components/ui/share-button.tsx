"use client";

import { Share2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ShareButton({
  url,
  title,
  text = "",
  variant = "outline",
  size = "sm",
  className,
}: ShareButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Check if Web Share API is supported (mainly mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        // User cancelled share or failed
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast({
          title: "Link Disalin!",
          description: "Link berhasil disalin ke clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Gagal menyalin",
          description: "Peramban Anda tidak mendukung fitur ini.",
        });
      }
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleShare} className={className}>
      {copied ? (
        <span className="flex items-center">
          <LinkIcon className="h-4 w-4 mr-2" /> Disalin
        </span>
      ) : (
        <span className="flex items-center">
          <Share2 className="h-4 w-4 mr-2" /> Bagikan
        </span>
      )}
    </Button>
  );
}

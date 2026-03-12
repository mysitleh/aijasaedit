"use client";
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  Copy,
  MessageCircle,
  X,
  Sparkles,
  User,
  CreditCard,
  ImageIcon,
  PenLine,
  Loader2,
} from "lucide-react";
import type { Service } from "@/app/actions";
import { createOrderAction } from "@/app/actions";
import { HARDCODED_SERVICES, SITE_CONFIG } from "@/data/site-config";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";

const STEPS = [
  { id: 1, label: "Service", icon: Sparkles },
  { id: 2, label: "Info", icon: User },
  { id: 3, label: "Details", icon: ImageIcon },
  { id: 4, label: "Payment", icon: CreditCard },
];

const personalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  whatsapp: z
    .string()
    .min(9, "Invalid phone number.")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid number."),
  email: z.string().email("Invalid email format.").optional().or(z.literal("")),
});

const detailSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(600, "Maximum 600 characters."),
});

type PersonalValues = z.infer<typeof personalSchema>;
type DetailValues = z.infer<typeof detailSchema>;

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const done = current > step.id;
        const active = current === step.id;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                    ? "border-primary text-primary bg-primary/10"
                    : "border-muted-foreground/30 text-muted-foreground/50"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? "text-primary" : done ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-14 mx-1 mb-4 rounded-full transition-all duration-300 ${
                  current > step.id ? "bg-primary" : "bg-muted-foreground/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-primary hover:bg-primary/10 transition-colors"
      title="Copy"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

import type { SiteSettings } from "@/types/settings";

export default function OrderFormEN({ 
  services: firebaseServices,
  settings 
}: { 
  services: Service[],
  settings: SiteSettings 
}) {
  const services = firebaseServices.length > 0 ? firebaseServices : HARDCODED_SERVICES;
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customServiceName, setCustomServiceName] = useState("");
  const [customNameError, setCustomNameError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [personal, setPersonal] = useState<PersonalValues | null>(null);
  const [description, setDescription] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const searchParams = useSearchParams();
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, [searchParams]);

  const effectiveServiceTitle = isOtherSelected
    ? customServiceName || "Other Service"
    : selectedService?.title ?? "";
  
  // English version price mapping
  const getPriceUSD = (priceStr: string) => {
    if (priceStr.toLowerCase().includes("contact") || priceStr === "0") return "Contact Us";
    if (priceStr.includes("75.000") || priceStr === "75000") return "$5";
    if (priceStr.includes("100.000") || priceStr === "100000") return "$7";
    if (priceStr.includes("50.000") || priceStr === "50000") return "$4";
    if (priceStr.includes("60.000") || priceStr === "60000") return "$4";
    if (priceStr.includes("65.000") || priceStr === "65000") return "$4";
    if (priceStr.includes("85.000") || priceStr === "85000") return "$6";
    return priceStr;
  };

  const effectiveServicePrice = isOtherSelected
    ? "Discussion"
    : getPriceUSD(selectedService?.price ?? "");

  const personalForm = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: { name: "", whatsapp: "", email: "" },
  });

  const detailForm = useForm<DetailValues>({
    resolver: zodResolver(detailSchema),
    defaultValues: { description: "" },
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileError(null);
    if (!f) return;
    if (f.size > 15 * 1024 * 1024) {
      setFileError("Maximum file size is 15MB.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, [preview]);

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const goToStep2 = () => {
    if (!selectedService && !isOtherSelected) return;
    if (isOtherSelected) {
      if (!customServiceName.trim()) {
        setCustomNameError("Please describe the service you want.");
        return;
      }
      setCustomNameError(null);
    }
    setStep(2);
  };

  const onPersonalSubmit = (data: PersonalValues) => {
    setPersonal(data);
    setStep(3);
  };

  const onDetailSubmit = async (data: DetailValues) => {
    if (!file) {
      setFileError("Please upload your photo or video.");
      return;
    }
    
    setIsSubmitting(true);
    setFileError(null);

    try {
      if (!storage || !storage.app) {
        throw new Error("Firebase Storage not detected.");
      }

      let fileUrl = "";
      const fileRef = ref(storage, `orders/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(uploadResult.ref);
      
      const result = await createOrderAction({
        name: personal?.name || "Customer",
        contact: personal?.whatsapp || "No Contact",
        service: `[EN] ${effectiveServiceTitle}`,
        description: data.description,
        fileUrl: fileUrl,
        referralCode: referralCode || undefined,
      });

      if (result.success) {
        setDescription(data.description);
        setStep(4);
        toast({
          title: "Success!",
          description: "Your order has been received.",
        });
      } else {
        setFileError(result.error || "Failed to submit order. Please contact support.");
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.error || "Failed to record order.",
        });
      }
    } catch (error: any) {
      console.error("Order process failed:", error);
      setFileError("Connection error. Please try again.");
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Please check your internet connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const lines = [
      "Hello, I'd like to confirm my payment for:",
      "",
      `*Name:* ${personal?.name}`,
      `*Phone/WA:* ${personal?.whatsapp}`,
      personal?.email ? `*Email:* ${personal.email}` : "",
      `*Service:* ${effectiveServiceTitle} (${effectiveServicePrice})`,
      `*Description:* ${description}`,
      `*File:* ${file?.name}`,
      "",
      "I have completed the payment and will attach the proof + files here.",
    ].filter(Boolean).join("\n");
    const msg = encodeURIComponent(lines);
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, "_blank");
  };

  return (
    <Card className="bg-card border border-border rounded-2xl overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <StepIndicator current={step} />

        {referralCode && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 px-3 py-1 text-xs font-semibold">
              🎁 Referral: {referralCode}
            </Badge>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-2">
              <h3 className="text-lg font-bold text-foreground">Select Service</h3>
              <p className="text-sm text-muted-foreground mt-1">Choose an AI editing service below</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((svc) => {
                const isSelected = !isOtherSelected && selectedService?.id === svc.id;
                return (
                  <button
                    key={svc.id}
                    onClick={() => {
                      setSelectedService(svc);
                      setIsOtherSelected(false);
                    }}
                    className={`group flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image src={svc.image_placeholder} alt={svc.title} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{svc.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{svc.description}</p>
                      <Badge variant={isSelected ? "default" : "secondary"} className="mt-1.5 font-bold">
                        {getPriceUSD(svc.price)}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsOtherSelected(true);
                setSelectedService(null);
              }}
              className={`w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 ${
                isOtherSelected ? "border-primary bg-primary/10" : "border-dashed border-border"
              }`}
            >
              <div className={`p-2 rounded-lg ${isOtherSelected ? 'bg-primary text-white' : 'bg-muted'}`}><PenLine className="h-5 w-5" /></div>
              <div><p className="text-sm font-semibold">Custom Service</p><p className="text-xs text-muted-foreground">Something else in mind? Let us know.</p></div>
            </button>

            {isOtherSelected && (
              <div className="space-y-1.5 animate-fade-in-up">
                <Input
                  placeholder="Describe your request..."
                  value={customServiceName}
                  onChange={(e) => setCustomServiceName(e.target.value)}
                />
                {customNameError && <p className="text-xs text-destructive">{customNameError}</p>}
              </div>
            )}

            <Button className="w-full" size="lg" onClick={goToStep2} disabled={!selectedService && !isOtherSelected}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-2">
              <h3 className="text-lg font-bold">Contact Info</h3>
              <p className="text-sm text-muted-foreground mt-1">Provide your details for us to reach you</p>
            </div>
            <Form {...personalForm}>
              <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-4">
                <FormField
                  control={personalForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalForm.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone / WhatsApp <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="+123456789" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button type="submit" className="flex-1">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="text-center mb-2">
              <h3 className="text-lg font-bold">Upload & Description</h3>
              <p className="text-sm text-muted-foreground mt-1">Upload your media and describe your request</p>
            </div>
            <div>
              {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-xl bg-background/50 cursor-pointer hover:bg-primary/5 transition-all">
                  <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm px-4 text-center">Click to select or drag files here</p>
                  <p className="text-xs text-muted-foreground mt-1">Max 15MB</p>
                </label>
              ) : (
                <div className="flex items-center gap-3 p-3 border rounded-xl">
                  {preview && file.type.startsWith("image/") ? <Image src={preview} alt="Preview" width={64} height={64} className="h-16 w-16 rounded-lg object-cover" /> : <ImageIcon className="h-12 w-12" />}
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{file.name}</p></div>
                  <button onClick={removeFile}><X className="h-5 w-5" /></button>
                </div>
              )}
              {fileError && <p className="text-xs text-destructive mt-1.5">{fileError}</p>}
            </div>
            <Form {...detailForm}>
              <form onSubmit={detailForm.handleSubmit(onDetailSubmit)} className="space-y-4">
                <FormField
                  control={detailForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Textarea placeholder="Tell us exactly how you want it..." {...field} className="min-h-[110px]" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Next to Payment"}</Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center">
              <h3 className="text-lg font-bold uppercase">Order Complete</h3>
              <p className="text-sm text-muted-foreground">Please complete the payment and confirm via WhatsApp</p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Payment</p>
              <p className="text-3xl font-black text-primary">{effectiveServicePrice}</p>
            </div>

            <div className="space-y-4">
               <div className="p-4 border rounded-xl bg-card">
                  <h4 className="font-bold text-sm mb-2">Internal Payment (PayPal)</h4>
                  <p className="text-xs text-muted-foreground mb-3">Secure payment via PayPal. Please contact support for invoice link.</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={openWhatsApp}>Request PayPal Link</Button>
               </div>
               
               <div className="p-4 border rounded-xl bg-card text-center italic text-xs text-muted-foreground">
                 By paying, you agree to our Terms of Service. Results delivered in 24h.
               </div>
            </div>

            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold" onClick={openWhatsApp}>
              <MessageCircle className="mr-2" /> Confirm via WhatsApp
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

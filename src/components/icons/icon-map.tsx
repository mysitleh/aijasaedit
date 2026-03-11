import { Car, Briefcase, GraduationCap, PawPrint, Rocket, Wand2, Camera, Video, Sparkles, FileText, Download, Phone } from "lucide-react";
import type { LucideProps } from "lucide-react";

export const ICONS = {
  Car: (props: LucideProps) => <Car {...props} />,
  Briefcase: (props: LucideProps) => <Briefcase {...props} />,
  GraduationCap: (props: LucideProps) => <GraduationCap {...props} />,
  PawPrint: (props: LucideProps) => <PawPrint {...props} />,
  Rocket: (props: LucideProps) => <Rocket {...props} />,
  Wand2: (props: LucideProps) => <Wand2 {...props} />,
  Camera: (props: LucideProps) => <Camera {...props} />,
  Video: (props: LucideProps) => <Video {...props} />,
  Sparkles: (props: LucideProps) => <Sparkles {...props} />,
  FileText: (props: LucideProps) => <FileText {...props} />,
  Download: (props: LucideProps) => <Download {...props} />,
  Phone: (props: LucideProps) => <Phone {...props} />,
};

export type IconName = keyof typeof ICONS;

export const iconList = Object.keys(ICONS) as IconName[];

export const renderIcon = (name: string, props?: LucideProps) => {
  const IconComponent = ICONS[name as IconName];
  return IconComponent ? <IconComponent {...props} /> : null;
};

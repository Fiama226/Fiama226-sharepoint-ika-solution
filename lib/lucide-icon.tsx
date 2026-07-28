import {
  Code2,
  Layers,
  FileEdit,
  GitBranch,
  CreditCard,
  ShieldCheck,
  Users,
  Globe,
  Clock,
  Heart,
  Headphones,
  Database,
  FileText,
  Settings,
  Scale,
  Plane,
  Megaphone,
  Briefcase,
  Calculator,
  type LucideIcon,
} from "lucide-react";

const REGISTRY: Record<string, LucideIcon> = {
  Code2,
  Layers,
  FileEdit,
  GitBranch,
  CreditCard,
  ShieldCheck,
  Users,
  Globe,
  Clock,
  Heart,
  Headphones,
  Database,
  FileText,
  Settings,
  Scale,
  Plane,
  Megaphone,
  Briefcase,
  Calculator,
};

export function LucideIcon({
  name,
  size = 18,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Cmp = REGISTRY[name];
  if (!Cmp) return null;
  return <Cmp size={size} className={className} />;
}

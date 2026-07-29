import { INewsItem } from "../../../models/IIkaModels";

export interface INewsCardsProps {
  eyebrow: string;
  title: string;
  description: string;
  items: INewsItem[];
  loading: boolean;
  error?: string;
  ctaUrl?: string;
  ctaLabel: string;
}

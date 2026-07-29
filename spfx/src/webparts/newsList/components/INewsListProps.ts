import { INewsItem } from "../../../models/IIkaModels";

export interface INewsListProps {
  title: string;
  items: INewsItem[];
  loading: boolean;
  error?: string;
  showImages: boolean;
  layout: "list" | "cards";
  seeAllUrl?: string;
}

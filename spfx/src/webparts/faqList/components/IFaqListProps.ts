import { IFaqItem } from "../../../models/IIkaModels";

export interface IFaqListProps {
  title: string;
  items: IFaqItem[];
  loading: boolean;
  error?: string;
  columns: number;
  groupByCategory: boolean;
  allowMultipleOpen: boolean;
}

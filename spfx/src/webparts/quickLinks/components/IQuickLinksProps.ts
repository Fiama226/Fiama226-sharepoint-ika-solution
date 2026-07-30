import { IQuickLink } from "../../../models/IIkaModels";

export interface IQuickLinksProps {
  title: string;
  links: IQuickLink[];
  loading: boolean;
  error?: string;
  columns: number;
  filterGroup?: string;
}

import { IGalleryImage } from "../../../models/IIkaModels";

export interface IGalleryProps {
  title: string;
  description: string;
  images: IGalleryImage[];
  loading: boolean;
  error?: string;
  showFilters: boolean;
  mosaicLayout: boolean;
  compact?: boolean;
}

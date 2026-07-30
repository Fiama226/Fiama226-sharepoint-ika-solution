import { ICollaborateur, IOrgNode } from "../../../models/IIkaModels";

export interface IOrgChartProps {
  title: string;
  subtitle: string;
  roots: IOrgNode[];
  flat: ICollaborateur[];
  loading: boolean;
  error?: string;
  showSearch: boolean;
  showControls: boolean;
  initialZoom: number;
  defaultCollapsedDepth: number;
}

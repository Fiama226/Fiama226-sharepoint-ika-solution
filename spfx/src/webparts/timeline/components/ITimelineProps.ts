import { IIndicator, IMilestone, IMission } from "../../../models/IIkaModels";

export interface ITimelineProps {
  eyebrow: string;
  title: string;
  description: string;
  milestones: IMilestone[];
  values: IMission[];
  stats: IIndicator[];
  loading: boolean;
  error?: string;
  showValues: boolean;
  showStats: boolean;
}

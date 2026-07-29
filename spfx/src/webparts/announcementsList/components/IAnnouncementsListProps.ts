import { IAnnouncement } from "../../../models/IIkaModels";

export interface IAnnouncementsListProps {
  eyebrow: string;
  title: string;
  description: string;
  announcements: IAnnouncement[];
  loading: boolean;
  error?: string;
  showFilters: boolean;
}

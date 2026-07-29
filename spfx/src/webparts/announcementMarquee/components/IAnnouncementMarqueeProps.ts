import { IAnnouncement } from "../../../models/IIkaModels";

export interface IAnnouncementMarqueeProps {
  eyebrow: string;
  title: string;
  announcements: IAnnouncement[];
  loading: boolean;
  error?: string;
  seeAllUrl?: string;
}

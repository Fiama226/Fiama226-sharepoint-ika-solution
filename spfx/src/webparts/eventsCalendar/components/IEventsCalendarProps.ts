import { IEventItem } from "../../../models/IIkaModels";

export interface IEventsCalendarProps {
  title: string;
  events: IEventItem[];
  loading: boolean;
  error?: string;
  showLocation: boolean;
}

import {
  IDocumentItem,
  IEventItem,
  IQuickLink,
} from "../../../models/IIkaModels";

export interface IQuickAccessPanelProps {
  documentsTitle: string;
  quickLinksTitle: string;
  eventsTitle: string;
  featuredDocs: IDocumentItem[];
  quickLinks: IQuickLink[];
  events: IEventItem[];
  loading: boolean;
  error?: string;
  eventsSeeAllUrl?: string;
}

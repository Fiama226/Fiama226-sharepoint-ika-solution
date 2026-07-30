import { IDocumentItem } from "../../../models/IIkaModels";

export interface IDocumentsListProps {
  title: string;
  documents: IDocumentItem[];
  loading: boolean;
  error?: string;
  showAllUrl?: string;
  showConfidentiality: boolean;
}

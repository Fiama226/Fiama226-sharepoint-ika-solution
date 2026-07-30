export interface IPriceSheetLineDraft {
  key: string;
  articleNo: string;
  description: string;
  deliveryDate: string;
  quantity: number;
  unitPrice: number;
}

export interface IPriceSheetProps {
  title: string;
  clientName: string;
  subject: string;
  vatRate: number;
  currency: string;
  initialLines: IPriceSheetLineDraft[];
  loading: boolean;
  error?: string;
  canEdit: boolean;
}

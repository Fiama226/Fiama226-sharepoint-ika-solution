import { IFinanceData } from "../../../models/IIkaModels";

export interface IFinanceChartsProps {
  title: string;
  description: string;
  data: IFinanceData[];
  fiscalYear: number;
  availableYears: number[];
  loading: boolean;
  error?: string;
  onYearChange: (year: number) => void;
}

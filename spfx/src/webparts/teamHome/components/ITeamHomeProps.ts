import { ICollaborateur } from "../../../models/IIkaModels";

export interface ITeamHomeProps {
  title: string;
  description: string;
  members: ICollaborateur[];
  loading: boolean;
  error?: string;
  showSearch: boolean;
  showBirthdays: boolean;
  compact?: boolean;
}

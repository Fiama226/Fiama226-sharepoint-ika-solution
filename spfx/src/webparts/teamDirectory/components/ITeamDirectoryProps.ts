import { ICollaborateur } from "../../../models/IIkaModels";

export interface ITeamDirectoryProps {
  title: string;
  members: ICollaborateur[];
  loading: boolean;
  error?: string;
  columns: number;
  showPhotos: boolean;
}

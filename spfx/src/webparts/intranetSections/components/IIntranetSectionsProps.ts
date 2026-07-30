import { IEmployeeOfMonth, IProject } from "../../../models/IIkaModels";

export interface IIntranetSectionsProps {
  employeeTitle: string;
  projectsTitle: string;
  projectsDescription: string;
  employee?: IEmployeeOfMonth;
  employeePhotoUrl?: string;
  projects: IProject[];
  loading: boolean;
  error?: string;
  showEmployee: boolean;
  showProjects: boolean;
}

import { IListTableData } from "../../../models/IIkaModels";

export interface IListTableProps {
  /** Titre affiché (h1), indépendant du nom de la liste SharePoint. */
  title: string;
  description?: string;
  /** Titre EXACT de la liste SharePoint à lire. */
  listTitle: string;
  iconName?: string;
  /**
   * Chargement paresseux : le composant appelle lui-même, au montage, plutôt
   * que de recevoir ses données en props. La liste n'est donc jamais chargée
   * tant que sa route n'est pas ouverte.
   */
  getListTable: (listTitle: string) => Promise<IListTableData>;
  showSearch?: boolean;
  showExport?: boolean;
}

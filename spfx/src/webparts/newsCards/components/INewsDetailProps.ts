import { IComment, INewsItem } from "../../../models/IIkaModels";

export interface INewsDetailProps {
  newsId?: number;
  /** Liste déjà chargée (page d'accueil/actualités) : sert de rendu instantané
   * pendant que la version complète (avec `Body`) se charge. */
  news: INewsItem[];
  currentUserEmail?: string;
  getNewsDetail: (id: number) => Promise<INewsItem | undefined>;
  getComments: (newsId: number) => Promise<IComment[]>;
  postComment: (newsId: number, text: string) => Promise<IComment>;
}

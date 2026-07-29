import {
  IHeroSlide,
  IIndicator,
  IMission,
} from "../../../models/IIkaModels";

export interface IHeroSliderProps {
  slides: IHeroSlide[];
  missions: IMission[];
  stats: IIndicator[];
  currentUser: string;
  currentUserRole: string;
  loading: boolean;
  error?: string;
  heightClass: string;
  showClock: boolean;
  showPanel: boolean;
}

export interface IBreadcrumbItem {
  label: string;
  url?: string;
}

export interface IPageHeaderProps {
  title: string;
  description?: string;
  breadcrumb: IBreadcrumbItem[];
}

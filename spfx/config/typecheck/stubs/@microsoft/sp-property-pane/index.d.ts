export interface IPropertyPaneField { targetProperty: string; }
export interface IPropertyPaneGroup { groupName?: string; groupFields: IPropertyPaneField[]; }
export interface IPropertyPanePage { header?: { description: string }; groups: IPropertyPaneGroup[]; }
export interface IPropertyPaneConfiguration { pages: IPropertyPanePage[]; }
export declare function PropertyPaneTextField(p: string, o?: unknown): IPropertyPaneField;
export declare function PropertyPaneSlider(p: string, o?: unknown): IPropertyPaneField;
export declare function PropertyPaneToggle(p: string, o?: unknown): IPropertyPaneField;
export declare function PropertyPaneDropdown(p: string, o?: unknown): IPropertyPaneField;

import { ISPImageField, ISPUrlField } from "../../models/IIkaModels";

export function parseImageField(
  field: ISPImageField | ISPUrlField | string | undefined | null
): string;

export function buildImageUrl(
  field: ISPImageField | ISPUrlField | string | undefined,
  width?: number
): string;

export function shouldUseMockDataByDefault(
  hostname: string,
  forced?: boolean
): boolean;

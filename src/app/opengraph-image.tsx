import {
  createSocialImage,
  socialImageSize,
} from "@/lib/social-image";

export const alt =
  "Daniel VLKO — Software Developer & Automation Architect";

export const size =
  socialImageSize;

export const contentType =
  "image/png";

export default function OpenGraphImage() {
  return createSocialImage();
}
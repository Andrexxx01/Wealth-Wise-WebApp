import sharp from "sharp";
import { AVATAR_MIME_TYPES, MAX_AVATAR_UPLOAD_BYTES } from "@/features/profile/lib/avatar-options";

export class AvatarValidationError extends Error {}

export async function prepareAvatar(input: Buffer, mimeType: string) {
  if (!input.length || input.length > MAX_AVATAR_UPLOAD_BYTES) {
    throw new AvatarValidationError("Choose an image up to 2 MB.");
  }
  if (!AVATAR_MIME_TYPES.includes(mimeType)) {
    throw new AvatarValidationError("Choose a JPG, PNG, or WebP image.");
  }
  try {
    const image = sharp(input, { limitInputPixels: 20_000_000, failOn: "warning" });
    const metadata = await image.metadata();
    const expected = { "image/jpeg": "jpeg", "image/png": "png", "image/webp": "webp" };
    if (metadata.format !== expected[mimeType as keyof typeof expected] ||
        !metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) {
      throw new AvatarValidationError("Choose a valid, non-animated JPG, PNG, or WebP image.");
    }
    // Re-encode pixels only; do not retain EXIF or other uploaded metadata.
    const output = await image.rotate().resize(256, 256, { fit: "cover" })
      .webp({ quality: 80 }).toBuffer();
    if (output.length > 64 * 1024) {
      throw new AvatarValidationError("This photo is too complex. Please choose another image.");
    }
    return `data:image/webp;base64,${output.toString("base64")}`;
  } catch (error) {
    if (error instanceof AvatarValidationError) throw error;
    throw new AvatarValidationError("This image could not be read. Choose a valid image under 20 megapixels.");
  }
}

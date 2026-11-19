import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { AvatarValidationError, prepareAvatar } from "@/features/profile/lib/avatar-image";
import { MAX_AVATAR_UPLOAD_BYTES } from "@/features/profile/lib/avatar-options";

export const runtime = "nodejs";

function isForeignOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin !== null && origin !== new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUserId();
    if (!auth.success) return auth.response;
    if (isForeignOrigin(request)) {
      return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
    }
    if (Number(request.headers.get("content-length")) > MAX_AVATAR_UPLOAD_BYTES + 128 * 1024) {
      return NextResponse.json({ message: "Choose an image up to 2 MB." }, { status: 413 });
    }
    const data = await request.formData().catch(() => null);
    const file = data?.get("avatar");
    if (!(file instanceof File) || !file.size || file.size > MAX_AVATAR_UPLOAD_BYTES) {
      return NextResponse.json({ message: "Choose an image up to 2 MB." }, { status: 400 });
    }
    const image = await prepareAvatar(Buffer.from(await file.arrayBuffer()), file.type);
    await prisma.user.update({ where: { id: auth.userId }, data: { image }, select: { id: true } });
    return NextResponse.json({ message: "Profile photo saved." });
  } catch (error) {
    if (error instanceof AvatarValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error("Failed to save avatar:", error);
    return NextResponse.json({ message: "Could not save your photo. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await getAuthenticatedUserId();
    if (!auth.success) return auth.response;
    if (isForeignOrigin(request)) {
      return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
    }
    await prisma.user.update({ where: { id: auth.userId }, data: { image: null }, select: { id: true } });
    return NextResponse.json({ message: "Profile photo removed." });
  } catch (error) {
    console.error("Failed to remove avatar:", error);
    return NextResponse.json({ message: "Could not remove your photo. Please try again." }, { status: 500 });
  }
}

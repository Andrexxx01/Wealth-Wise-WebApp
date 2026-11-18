import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/features/profile/lib/profile-schema";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const auth = await getAuthenticatedUserId();
    if (!auth.success) return auth.response;

    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) {
      return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
    }

    const parsed = profileSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({
        message: "Enter a name between 1 and 80 characters. Only the display name can be updated here.",
      }, { status: 400 });
    }

    const profile = await prisma.user.update({
      where: { id: auth.userId },
      data: { name: parsed.data.name },
      select: { id: true, name: true },
    });
    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error("Failed to update account profile:", error);
    return NextResponse.json({ message: "Could not save your name. Please try again." }, { status: 500 });
  }
}

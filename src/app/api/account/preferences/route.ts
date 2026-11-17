import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { preferencesSchema } from "@/features/settings/lib/preferences-schema";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const auth = await getAuthenticatedUserId();
    if (!auth.success) return auth.response;

    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) {
      return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
    }

    const parsed = preferencesSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ message: "Choose a supported currency and theme." }, { status: 400 });
    }

    const preferences = await prisma.user.update({
      where: { id: auth.userId },
      data: parsed.data,
      select: { currency: true, theme: true },
    });
    const response = NextResponse.json({ data: preferences });
    response.cookies.set("wealthwise-theme", preferences.theme, {
      httpOnly: true,
      secure: new URL(request.url).protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch (error) {
    console.error("Failed to save account preferences:", error);
    return NextResponse.json({ message: "Could not save preferences. Please try again." }, { status: 500 });
  }
}

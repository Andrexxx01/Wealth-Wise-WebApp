import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { changePasswordSchema } from "@/features/settings/lib/password-schema";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const auth = await getAuthenticatedUserId();
    if (!auth.success) return auth.response;

    if (request.headers.get("origin") !== new URL(request.url).origin) {
      return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
    }
    // Bound the actual body as well as the declared size before parsing JSON.
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ message: "Invalid request." }, { status: 400 });
    let body = "";
    let bytes = 0;
    const decoder = new TextDecoder();
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 16384) {
        await reader.cancel();
        return NextResponse.json({ message: "Request is too large." }, { status: 413 });
      }
      body += decoder.decode(chunk.value, { stream: true });
    }
    body += decoder.decode();
    let payload: unknown;
    try { payload = JSON.parse(body); } catch {
      return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
    }
    const parsed = changePasswordSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid password details." }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: auth.userId }, select: { passwordHash: true },
    });
    if (!user?.passwordHash) {
      return NextResponse.json({ message: "Password changes are unavailable for this account." }, { status: 400 });
    }
    if (!await bcrypt.compare(parsed.data.currentPassword, user.passwordHash)) {
      return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
    }
    if (await bcrypt.compare(parsed.data.newPassword, user.passwordHash)) {
      return NextResponse.json({ message: "Choose a different password." }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    // A concurrent change must not overwrite a newer password.
    const updated = await prisma.user.updateMany({
      where: { id: auth.userId, passwordHash: user.passwordHash },
      data: { passwordHash },
    });
    if (updated.count !== 1) {
      return NextResponse.json({ message: "Your password changed during this request. Try again." }, { status: 409 });
    }
    return NextResponse.json({ message: "Password updated. Use your new password the next time you sign in." });
  } catch {
    // Never log request data or password hashes.
    return NextResponse.json({ message: "Unable to update your password. Try again." }, { status: 500 });
  }
}

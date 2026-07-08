import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "demo@wealthwise.local";

export async function getDemoUserId() {
  const user = await prisma.user.upsert({
    where: {
      email: DEMO_USER_EMAIL,
    },
    update: {},
    create: {
      email: DEMO_USER_EMAIL,
      name: "Demo User",
      passwordHash: "demo-password-hash",
    },
  });

  return user.id;
}

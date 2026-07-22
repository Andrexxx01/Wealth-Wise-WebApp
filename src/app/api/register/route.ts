import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { registerSchema } from "@/features/auth/schemas/auth.schema";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsedBody.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email is already registered.",
        },
        {
          status: 409,
        },
      );
    }

    const passwordHash = await bcrypt.hash(parsedBody.password, 12);

    const user = await prisma.user.create({
      data: {
        name: parsedBody.name,
        email: parsedBody.email,
        passwordHash,
        plan: "FREE",
        subscriptionStatus: "NONE",
      },
    });

    return NextResponse.json(
      {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/register error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid register payload.",
          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to register user.",
      },
      {
        status: 500,
      },
    );
  }
}

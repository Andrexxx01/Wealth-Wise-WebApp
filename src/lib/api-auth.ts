import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";

type AuthenticatedUserResult =
  | {
      success: true;
      userId: string;
    }
  | {
      success: false;
      response: NextResponse;
    };

export async function getAuthenticatedUserId(): Promise<AuthenticatedUserResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      response: NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        },
      ),
    };
  }

  return {
    success: true,
    userId,
  };
}

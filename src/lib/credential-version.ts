import { createHash } from "node:crypto";

export function getCredentialVersion(passwordHash: string): string {
  return createHash("sha256").update(passwordHash).digest("hex");
}

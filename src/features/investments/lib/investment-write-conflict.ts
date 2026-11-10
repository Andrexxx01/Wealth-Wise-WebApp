export function isInvestmentWriteConflict(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if ("code" in error && error.code === "P2034") {
    return true;
  }

  // The PostgreSQL adapter can expose a write conflict directly as the cause.
  const cause = "cause" in error ? error.cause : null;

  return (
    typeof cause === "object" &&
    cause !== null &&
    "kind" in cause &&
    cause.kind === "TransactionWriteConflict"
  );
}

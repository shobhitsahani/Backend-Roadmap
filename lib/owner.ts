import "server-only";

/**
 * Guest-first owner. Every state query is scoped by this value today.
 * When accounts land, this resolves to the authenticated user id instead,
 * without changing a single state table.
 */
export const GUEST_OWNER_ID = "guest-local";

export function getOwnerId(): string {
  return GUEST_OWNER_ID;
}

/**
 * Create Workspace Invites (Bulk)
 * Processes multiple invite requests and returns per-item results
 */

import { createWorkspaceInvite } from "./createWorkspaceInvite.js";

export const createWorkspaceInvitesBulk = async (
  workspaceId,
  invites,
  requesterId
) => {
  if (!Array.isArray(invites) || invites.length === 0) {
    throw new Error("'invites' must be a non-empty array");
  }

  // Soft limit to prevent abuse
  const MAX_BULK = 50;
  if (invites.length > MAX_BULK) {
    throw new Error(`Too many invites in one request (max ${MAX_BULK})`);
  }

  const results = [];
  for (const item of invites) {
    try {
      const notification = await createWorkspaceInvite(
        workspaceId,
        item,
        requesterId
      );
      results.push({ input: item, ok: true, notification });
    } catch (err) {
      results.push({
        input: item,
        ok: false,
        error: err.message || String(err),
      });
    }
  }

  const summary = {
    total: results.length,
    success: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
  };

  return { results, summary };
};

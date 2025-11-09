import TagDefinition from "../../models/TagDefinition/index.js";

/**
 * Normalize tag names: trim, collapse spaces, to lower case.
 */
const normalizeTagName = (name) =>
  String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

/**
 * Ensure all provided tag names exist for the given workspace.
 * Returns a deduped, normalized array of names.
 * Throws an Error with message including missing tag names when any are missing.
 */
export const ensureExistingTags = async (workspaceId, tagNames) => {
  if (!Array.isArray(tagNames)) return [];
  const normalized = tagNames.map(normalizeTagName).filter((t) => t.length > 0);
  const unique = [...new Set(normalized)];
  if (unique.length === 0) return [];

  const defs = await TagDefinition.find({
    workspace: workspaceId,
    name: { $in: unique },
  })
    .select("name")
    .lean();
  const found = new Set(defs.map((d) => d.name));
  const missing = unique.filter((n) => !found.has(n));
  if (missing.length > 0) {
    const err = new Error(
      `Unknown tag(s) for this workspace: ${missing.join(", ")}`
    );
    err.statusCode = 400;
    throw err;
  }
  return unique;
};

export default { ensureExistingTags };

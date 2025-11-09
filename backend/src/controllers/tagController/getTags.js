import TagDefinition from "../../models/TagDefinition/index.js";

export const getTags = async (req, res, next) => {
  try {
    const { workspace } = req.query;
    const filter = {};
    if (workspace) filter.workspace = workspace;
    // Default: current user's workspaces can be enforced by other middleware if needed
    const tags = await TagDefinition.find(filter).sort({ name: 1 }).lean();
    res.status(200).json({ success: true, count: tags.length, tags });
  } catch (error) {
    next(error);
  }
};

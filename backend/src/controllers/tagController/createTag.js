import TagDefinition from "../../models/TagDefinition/index.js";

export const createTag = async (req, res, next) => {
  try {
    const { name, color, backgroundColor, workspace } = req.body;
    const userId = req.user?._id || req.user?.id;
    const tag = await TagDefinition.create({
      name,
      color,
      backgroundColor,
      workspace,
      createdBy: userId,
    });
    res.status(201).json({ success: true, tag });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Tag name already exists" });
    }
    next(error);
  }
};

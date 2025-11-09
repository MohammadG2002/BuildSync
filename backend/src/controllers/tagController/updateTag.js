import TagDefinition from "../../models/TagDefinition/index.js";

export const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, color, backgroundColor } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;
    if (backgroundColor !== undefined)
      updates.backgroundColor = backgroundColor;

    const tag = await TagDefinition.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }
    res.status(200).json({ success: true, tag });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Tag name already exists" });
    }
    next(error);
  }
};

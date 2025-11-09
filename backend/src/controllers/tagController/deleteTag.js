import TagDefinition from "../../models/TagDefinition/index.js";

export const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = await TagDefinition.findByIdAndDelete(id);
    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }
    res.status(200).json({ success: true, message: "Tag deleted" });
  } catch (error) {
    next(error);
  }
};

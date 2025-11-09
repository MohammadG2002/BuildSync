/**
 * TagDefinition Model
 */
import mongoose from "mongoose";
import { tagDefinitionSchema } from "./tagDefinitionSchema.js";

const TagDefinition = mongoose.model("TagDefinition", tagDefinitionSchema);

export default TagDefinition;
export { TagDefinition };

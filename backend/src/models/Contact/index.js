/**
 * Contact Model
 */

import mongoose from "mongoose";
import { contactSchema } from "./contactSchema.js";

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;

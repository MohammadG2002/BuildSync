import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const cleanMalformedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("projects");

    // Get all projects to inspect
    const allProjects = await collection.find({}).toArray();
    console.log(`Total projects: ${allProjects.length}`);

    // Find malformed ones (missing required 'name' field as a proper field)
    const malformed = allProjects.filter((doc) => {
      // Check if document is malformed (has weird field names or missing proper fields)
      const fieldNames = Object.keys(doc);
      const hasWeirdFields = fieldNames.some(
        (field) =>
          field.includes('"') || field.includes("{") || field.includes("\\")
      );
      const lacksProperName =
        typeof doc.name !== "string" || doc.name === undefined;
      return hasWeirdFields || (lacksProperName && doc._id);
    });

    console.log(`Found ${malformed.length} malformed project(s)`);

    if (malformed.length > 0) {
      malformed.forEach((doc) => {
        console.log(
          "Malformed document ID:",
          doc._id,
          "Fields:",
          Object.keys(doc)
        );
      });

      // Delete by IDs
      const idsToDelete = malformed.map((doc) => doc._id);
      const deleteResult = await collection.deleteMany({
        _id: { $in: idsToDelete },
      });

      console.log(`Deleted ${deleteResult.deletedCount} malformed project(s)`);
    }

    await mongoose.connection.close();
    console.log("Cleanup complete");
  } catch (error) {
    console.error("Error cleaning up:", error);
    process.exit(1);
  }
};

cleanMalformedProjects();

import mongoose from "mongoose"

// Tag Schema
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tag name is required"],
    unique: true, // Ensures that each tag name is unique
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Tag", tagSchema);

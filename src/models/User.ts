import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },  // Added index for performance
  email: { type: String, required: true, unique: true, index: true },     // Added index for performance
  password: { type: String, required: true },
}, { timestamps: true });  // Add timestamps for tracking creation and update times

export default mongoose.models.User || mongoose.model("User", UserSchema);

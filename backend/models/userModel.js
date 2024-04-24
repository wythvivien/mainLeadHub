import mongoose from "mongoose";

// Defining schema for user data
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
    },

    displayName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    accessToken: {
      type: String,
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create the User model using the schema
const User = mongoose.model("users", userSchema);

export default User;

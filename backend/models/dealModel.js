import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    phone: {
      type: String,
    },

    project: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    value: {
      type: Number,
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Deal = mongoose.model("deal", dealSchema);
export default Deal;

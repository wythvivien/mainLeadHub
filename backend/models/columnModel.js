import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
    },

    leads: [
      {
        leadId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lead",
        },
        account: {
          type: String,
        },
        email: {
          type: String,
        },
        image: {
          type: String,
        },
        oppVal: {
          type: Number,
          default: 0
        },
        updatedAt: {
          type: String,
        },
        tags: {
          type:[String]
        }
      },
    ],

    position: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Column = mongoose.model("column", columnSchema);
export default Column;

 
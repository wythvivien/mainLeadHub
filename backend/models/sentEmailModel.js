import mongoose from "mongoose";

const sentEmailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  recipient: {
    type: String,
    required: true,
    unique: true,
  },

  link: {
    type: String,
    required: true,
  },
});

const SentEmail = mongoose.model("sentEmail", sentEmailSchema);

export default SentEmail;

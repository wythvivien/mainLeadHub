import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Defining the schema for lead data
const leadSchema = new mongoose.Schema(
  {
    // Reference to the user associated with the lead
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    account: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    link: {
      type: String,
      required: function () {
        return this.source === "Email Inquiry";
      },
    },

    image: {
      type: String,
      required: true,
    },

    // Status of the lead, must be one of enum
    status: {
      type: String,
      enum: ["Warm", "Cold", "Dead"],
      required: true,
    },

    column: {
      type: String,
    },

    number: {
      type: String,
    },

    company: {
      type: String,
    },

    address: {
      type: String,
    },

    source: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
    },

    notes: {
      type: [noteSchema],
    },

    value: {
      type: Number,
      default: 0
    }, 

    deleted: {
      type: Boolean,
      default: false
    },

    expirationDate: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration to 1 week (7 days) from now
      required: function () {
        return this.status === "Cold";
      },
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

leadSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    (this.status === "Warm" || this.status === "Dead")
  ) {
    this.expirationDate = undefined;
  } else {
    this.expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  if ((this.isModified("status") || this.isNew) && this.status !== "Warm") {
    this.column = undefined;
  }
  next();
});


// Create the Lead model using the schema
const Lead = mongoose.model("leads", leadSchema);

export default Lead;

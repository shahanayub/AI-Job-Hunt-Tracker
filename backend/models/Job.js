const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },

  position: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  url: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    default: "Applied",
  },

  applicationDate: {
    type: Date,
    default: Date.now,
  },

  followUpDate: {
    type: Date,
  },

  notes: {
    type: String,
    default: "",
  },

  matchScore: {
    type: Number,
    default: 0,
  },

  analysis: {
    strengths: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },
  },

  statusHistory: [
    {
      status: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Job", jobSchema);
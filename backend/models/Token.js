const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: { type: String, default: "default_user" },
  tokens: { type: Object, required: true },
});

module.exports = mongoose.model("Token", tokenSchema);
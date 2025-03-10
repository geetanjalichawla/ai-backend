const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true },
  level: { type: String, enum: ["Easy", "Intermediate", "Hard"], required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Test", testSchema);

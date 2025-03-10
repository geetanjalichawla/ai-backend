const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // Array of answer choices
  correctAnswer: { type: String, required: true },
  hint: { type: String }, // Optional hint provided by API
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Question", questionSchema);

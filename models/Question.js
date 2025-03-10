const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  noOfQuestions: {
    type: Number,
    required: true,
  },
  questions: [
    {
      question: { type: String, required: true }, // Single question string
      options: { type: Object, required: true }, // Object with keys a, b, c, d
      correctAnswer: { type: String, required: true }, // Correct answer key (e.g., "a", "b", etc.)
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
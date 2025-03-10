const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Gemini AI
const Question = require("../models/Question"); // Import your Question model

// Initialize Gemini AI
const GEMINI_API_KEY = "AIzaSyAp3c_NHCIa8Hwb3AlJ1S-E1WRgnuDmc-E";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY); // Use environment variable for API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

router.post("/gemini", async (req, res) => {
  try {
    // Define the prompt to request 5 questions with options and correct answers
    const prompt = `Generate ${"5"} multiple-choice questions about ${"Java"} for beginners. Each question should have:
- 4 options (a, b, c, d)
- A correct answer
Format the response as a JSON-like structure without using Markdown or code blocks. Example:
[
  {
    "question": "What does HTML stand for?",
    "options": {
      "a": "Hyperlinks and Text Markup Language",
      "b": "Home Tool Markup Language",
      "c": "Hyper Text Markup Language",
      "d": "Hyper Text Machine Language"
    },
    "correctAnswer": "c"
  },
  {
    "question": "Which tag is used to create a hyperlink in HTML?",
    "options": {
      "a": "<link>",
      "b": "<a>",
      "c": "<href>",
      "d": "<hyperlink>"
    },
    "correctAnswer": "b"
  }
]`;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt must be a valid string" });
    }

    // ✅ Correct format for API request
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    // Log the full result to debug
    console.log("Full API Response:", JSON.stringify(result, null, 2));

    // ✅ Extract response text safely
    const textResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      return res.status(500).json({ error: "Empty response from Gemini API" });
    }

    // Log the response text to the console
    console.log("Gemini API Response Text:", textResponse);

    // Parse the response into a structured format
    let structuredQuestions;
    try {
      structuredQuestions = JSON.parse(textResponse); // Parse the JSON-like response
    } catch (error) {
      console.error("❌ Error parsing response:", error);
      return res.status(500).json({ error: "Failed to parse Gemini API response" });
    }

    // Log the structured questions
    console.log("Structured Questions:", structuredQuestions);

    // Save questions to the database
    const savedQuestions = await Question.insertMany(
      structuredQuestions.map((q) => ({
        testId: req.body.testId, // Assuming testId is passed in the request body
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      }))
    );

    res.json({ success: true, questions: savedQuestions });

  } catch (error) {
    console.error("❌ Error generating content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
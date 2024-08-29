const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connection = require("./config/db.js");
const PromptModel = require("./model/UserModel.js");

const PORT = process.env.PORT || 5000;

const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Middleware to parse JSON request bodies
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run(req, res) {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // Added 'await' to ensure the text is properly fetched

    res.json({ text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
}

app.post("/generate", run);

app.post("/prompt", async (req, res) => {
  const { prompt } = req.body;
  try {
    const newPrompt = new PromptModel({ prompt });
    await newPrompt.save();
    res
      .status(200)
      .json({ Message: "Prompt is successfully added", Prompt: newPrompt });
  } catch (error) {
    res.status(400).json({ Message: error.message });
    console.log(error.message);
  }
});

app.get("/recent", async (req, res) => {
  try {
    const prompts = await PromptModel.find();
    if (!prompts) {
      return res.status(404).json({ Message: "Prompt not found" });
    }
    res.status(200).json({ Prompts: prompts });
  } catch (error) {
    return res.status(400).json({ Message: error.message });
  }
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`Server is running on port ${PORT}`);
    console.log("Server is successfully connected to the database");
  } catch (error) {
    console.log(error.message);
  }
});

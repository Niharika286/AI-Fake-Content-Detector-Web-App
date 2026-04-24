const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("AI Detector Backend Running 🚀");
});
app.post("/detect-image", (req, res) => {
    // Fake detection logic
    const score = Math.random();

    res.json({ score });
});
// 🔥 AI Detection Route
app.post("/detect-text", async (req, res) => {
    try {
        const { text } = req.body;

        const response = await axios.post(
            "https://api.sapling.ai/api/v1/aidetect",
            {
                key: process.env.SAPLING_API_KEY,
                text: text
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Detection failed" });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.post("/detect-url", async (req, res) => {
  const { url } = req.body;

  try {
    const response = await axios.get(url, {
        timeout: 5000,
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    });
    const html = response.data;

    const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 3000);
    console.log("Extracted text:", text.slice(0, 300));
    const aiResponse = await axios.post(
      "https://api.sapling.ai/api/v1/aidetect",
      {
        key: process.env.SAPLING_API_KEY,
        text: text
      }
    );
    console.log(aiResponse.data);

    let score = 0;

    if (aiResponse.data.sentence_scores) {
        const scores = aiResponse.data.sentence_scores.map(s => s.score);
        score = scores.reduce((a, b) => a + b, 0) / scores.length;
    } else {
        score = aiResponse.data.score || 0;
    }
    

    res.json({ score });

  } catch (error) {
        console.error("URL ERROR:", error.message);

        res.json({
            score: 0,
            message: "⚠️ Unable to analyze this website (blocked or dynamic content)"
        });
    }
});
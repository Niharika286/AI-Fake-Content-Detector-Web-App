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
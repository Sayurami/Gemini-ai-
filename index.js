
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

/* 🔥 Root Route */
app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "🚀 Gemini API Running on Vercel"
  });
});

/* 🤖 AI Route */
app.get("/ai", async (req, res) => {
  try {
    const q = req.query.q;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!q) {
      return res.status(400).json({
        status: false,
        error: "Query parameter 'q' is required"
      });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: q }]
          }
        ]
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI Response";

    res.json({
      status: true,
      model: "gemini-2.5-flash",
      result: reply
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.response?.data || error.message
    });
  }
});

/* ✅ IMPORTANT — EXPORT FOR VERCEL */
export default app;

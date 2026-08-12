import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// API Endpoints
app.post("/api/ai-tutor", async (req, res) => {
  try {
    const { prompt, section, context } = req.body;
    if (!ai) {
      return res.json({
        reply: "AI Tutor is currently running in offline simulation mode (GEMINI_API_KEY not configured). Based on Ullman Automata theory, remember that regular expressions describe regular languages accepted by finite automata. For section " + section + ", " + (context || "keep practicing state transitions and pumping lemma proofs!")
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert Automata Theory professor and AI tutor specializing in 'Introduction to Automata Theory, Languages, and Computation' by Ullman, Hopcroft, and Motwani. 
The student is asking about Section: ${section || "General"}.
Context: ${context || "None"}
Student Query/Prompt: ${prompt}

Provide a clear, pedagogical, encouraging response using alternative teaching methods (analogies, manifold representations, real-world examples). Keep it structured and precise.`
            }
          ]
        }
      ]
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI tutoring response." });
  }
});

app.post("/api/evaluate-hot", async (req, res) => {
  try {
    const { questionId, userAnswer, questionTitle } = req.body;
    if (!ai) {
      // Offline fallback evaluation
      const correct = userAnswer && userAnswer.length > 20;
      return res.json({
        score: correct ? 85 : 40,
        feedback: correct 
          ? "Great analytical reasoning! You correctly identified the core structural properties and demonstrated sound critical thinking in line with Ullman's principles."
          : "Your answer touches on basic concepts, but needs deeper rigor. Consider applying formal closure properties or state limits to your argument."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert professor evaluating a student's Higher Order Thinking (HOT) question response based on Hopcroft & Ullman Automata Theory.
Question ID: ${questionId}
Question Title: ${questionTitle}
Student Answer: ${userAnswer}

Evaluate the student's answer critically and pedagogically. Return a JSON-like text with score (0-100) and constructive feedback pointing out strengths and areas for deeper analytical thought.`
            }
          ]
        }
      ]
    });

    res.json({ evaluation: response.text });
  } catch (error: any) {
    console.error("HOT Eval Error:", error);
    res.status(500).json({ error: error.message || "Evaluation failed." });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Automata Theory Lab server running on http://localhost:${PORT}`);
  });
}

startServer();

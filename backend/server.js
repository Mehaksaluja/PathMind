import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateRoadmap } from './services/roadmapService.js'
import { getChatbotResponse } from './services/chatbotService.js'
import { connectDatabase } from './config/database.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PathMind API is running' })
})

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint - to be implemented' })
})

app.post('/api/auth/signup', (req, res) => {
  res.json({ message: 'Signup endpoint - to be implemented' })
})

app.post('/api/roadmaps/generate', async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === '' || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return res.status(500).json({ 
        error: 'Groq API key is not configured. Please set GROQ_API_KEY in your .env file.',
        hint: 'Get your API key from: https://console.groq.com/keys'
      })
    }

    const roadmap = await generateRoadmap(prompt)
    res.json({ roadmap })
  } catch (error) {
    console.error('Error generating roadmap:', error)
    res.status(500).json({ error: error.message || 'Failed to generate roadmap' })
  }
})

app.get('/api/roadmaps/:id', (req, res) => {
  res.json({ message: 'Get roadmap endpoint - to be implemented' })
})

app.post('/api/chatbot/ask', async (req, res) => {
  try {
    const { question, context } = req.body

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' })
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === '' || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return res.status(500).json({ 
        error: 'Groq API key is not configured. Please set GROQ_API_KEY in your .env file.',
        hint: 'Get your API key from: https://console.groq.com/keys'
      })
    }

    const response = await getChatbotResponse(question, context || {})
    res.json({ response })
  } catch (error) {
    console.error('Error generating chatbot response:', error)
    res.status(500).json({ error: error.message || 'Failed to generate response' })
  }
})

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      try {
        await connectDatabase()
      } catch (dbError) {
        console.log('MongoDB connection failed, but server will continue without database.')
        console.log('Error:', dbError.message)
        console.log('You can still use the app, but data will not be saved.')
      }
    } else {
      console.log('MongoDB URI not configured. Running without database.')
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

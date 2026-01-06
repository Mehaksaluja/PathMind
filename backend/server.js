import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateRoadmap } from './services/roadmapService.js'
import { getChatbotResponse } from './services/chatbotService.js'
import { connectDatabase } from './config/database.js'
import { registerUser, loginUser } from './services/authService.js'
import { authenticateToken } from './middleware/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PathMind API is running' })
})

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    const result = await registerUser(name, email, password)
    res.status(201).json(result)
  } catch (error) {
    console.error('Error during signup:', error)
    res.status(400).json({ error: error.message || 'Signup failed' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const result = await loginUser(email, password)
    res.json(result)
  } catch (error) {
    console.error('Error during login:', error)
    res.status(401).json({ error: error.message || 'Login failed' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
      },
    })
  } catch (error) {
    console.error('Error getting user:', error)
    res.status(500).json({ error: 'Failed to get user information' })
  }
})

app.post('/api/roadmaps/generate', authenticateToken, async (req, res) => {
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

app.post('/api/chatbot/ask', authenticateToken, async (req, res) => {
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

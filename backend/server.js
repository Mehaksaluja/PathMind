import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PathMind API is running' })
})

// Auth routes (placeholder - will be implemented later)
app.post('/api/auth/login', (req, res) => {
  // TODO: Implement login logic
  res.json({ message: 'Login endpoint - to be implemented' })
})

app.post('/api/auth/signup', (req, res) => {
  // TODO: Implement signup logic
  res.json({ message: 'Signup endpoint - to be implemented' })
})

// Roadmap routes (placeholder - will be implemented later)
app.post('/api/roadmaps/generate', (req, res) => {
  // TODO: Implement roadmap generation logic
  res.json({ message: 'Roadmap generation endpoint - to be implemented' })
})

app.get('/api/roadmaps/:id', (req, res) => {
  // TODO: Implement get roadmap logic
  res.json({ message: 'Get roadmap endpoint - to be implemented' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})


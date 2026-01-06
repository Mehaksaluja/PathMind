import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export async function registerUser(name, email, password) {
  const existingUser = await User.findOne({ email })
  
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  const user = new User({
    name,
    email,
    password,
  })

  await user.save()

  const token = generateToken(user._id.toString())

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    token,
  }
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email })
  
  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isPasswordValid = await user.comparePassword(password)
  
  if (!isPasswordValid) {
    throw new Error('Invalid email or password')
  }

  const token = generateToken(user._id.toString())

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    token,
  }
}

export async function getUserById(userId) {
  const user = await User.findById(userId).select('-password')
  return user
}


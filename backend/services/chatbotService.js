import Groq from 'groq-sdk'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.GROQ_API_KEY
if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
  console.error('GROQ_API_KEY is not set or invalid in .env file')
  console.error('Please set GROQ_API_KEY in your .env file')
  console.error('Get your API key from: https://console.groq.com/keys')
}

let client = null
try {
  if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_groq_api_key_here') {
    client = new Groq({
      apiKey: apiKey,
    })
    console.log('Groq AI Chatbot initialized with llama-3.3-70b-versatile')
  }
} catch (error) {
  console.error(`Error configuring Groq: ${error.message}`)
}

export async function getChatbotResponse(question, context = {}) {
  try {
    let contextString = `You are a helpful AI learning assistant for PathMind, an educational roadmap platform. 
Your role is to answer questions about learning topics, provide explanations, clarify concepts, and guide users through their learning journey.

Be concise but thorough, friendly, and encouraging. Use the context provided to give relevant, accurate answers.

Current Context:
${context.roadmapTitle ? `Roadmap: ${context.roadmapTitle}` : ''}
${context.roadmapDescription ? `Roadmap Description: ${context.roadmapDescription}` : ''}

${context.topicTitle ? `Current Topic: ${context.topicTitle}` : ''}
${context.topicDescription ? `Topic Description: ${context.topicDescription}` : ''}
${context.topicLevel ? `Difficulty Level: ${context.topicLevel}` : ''}
${context.estimatedHours ? `Estimated Time: ${context.estimatedHours} hours` : ''}

${context.resources && context.resources.length > 0 ? `\nAvailable Resources:\n${context.resources.map((r, i) => `${i + 1}. ${r.title} (${r.type}): ${r.url}`).join('\n')}` : ''}

${context.parentTopic ? `\nParent Topic: ${context.parentTopic}` : ''}
${context.subtopics && context.subtopics.length > 0 ? `\nRelated Subtopics: ${context.subtopics.map(st => st.title).join(', ')}` : ''}

${context.roadmapStructure ? `\nRoadmap Structure Overview:\n${context.roadmapStructure}` : ''}

When answering:
- Reference specific resources when relevant
- Explain how topics connect to each other
- Provide practical examples when helpful
- Encourage the user and acknowledge their progress
- If asked about something not in context, provide general guidance but note that you're working with limited context`

    if (!client) {
      throw new Error('Groq API key is not configured. Please set GROQ_API_KEY in your .env file.')
    }

    const chatCompletion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: contextString,
        },
        {
          role: 'user',
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    const text = chatCompletion.choices[0]?.message?.content?.trim() || ''
    
    if (!text) {
      throw new Error('No response received from Groq API')
    }

    return text
  } catch (error) {
    console.error(`Error generating text with Groq: ${error.message}`)
    throw new Error(`Failed to generate response: ${error.message}`)
  }
}

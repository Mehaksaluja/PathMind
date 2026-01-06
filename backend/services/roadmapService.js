import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.GROQ_API_KEY
if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
  console.error('GROQ_API_KEY is not set or invalid in .env file')
  console.error('Please set GROQ_API_KEY in your .env file')
  console.error('Get your API key from: https://console.groq.com/keys')
}

const client = new OpenAI({
  apiKey: apiKey || '',
  baseURL: 'https://api.groq.com/openai/v1',
})

export async function generateRoadmap(prompt) {
  try {
    const systemPrompt = `You are an expert learning path advisor. Your task is to create a comprehensive, deeply hierarchical learning roadmap based on the user's learning goal.

CRITICAL REQUIREMENTS:
1. The roadmap MUST be 4-5 levels deep minimum. For example:
   - Level 1: Main topic (e.g., "React")
   - Level 2: Major subtopics (e.g., "React Components", "React Hooks", "State Management")
   - Level 3: Specific concepts under each subtopic (e.g., "Functional Components", "Class Components" under "React Components")
   - Level 4: Detailed topics (e.g., "JSX Syntax", "Props", "Component Lifecycle" under "Functional Components")
   - Level 5: Advanced subtopics (e.g., "PropTypes", "Default Props", "Children Prop" under "Props")

2. Each topic MUST have:
   - id: unique identifier (e.g., "react-components-functional")
   - title: clear, specific title
   - description: comprehensive explanation (at least 2-3 sentences) explaining what it is, why it matters, and how it fits into the learning path
   - level: beginner/intermediate/advanced
   - estimatedHours: realistic time estimate
   - resources: array of 3-5 high-quality resources with:
     * title: descriptive name
     * url: valid documentation/tutorial URL (use real URLs like MDN, official docs, etc.)
     * type: "documentation" | "tutorial" | "video" | "article" | "course"
   - children: array of subtopics (MUST be present for levels 1-4, optional for level 5)

3. Resources should be REAL and RELEVANT:
   - Use official documentation when available (e.g., react.dev, MDN Web Docs, Python.org, nodejs.org)
   - Include popular tutorials and courses (e.g., freeCodeCamp, MDN, official docs)
   - For React topics: use react.dev, beta.reactjs.org
   - For JavaScript: use developer.mozilla.org (MDN)
   - For Python: use docs.python.org, realpython.com
   - For Node.js: use nodejs.org/docs
   - For web technologies: use web.dev, caniuse.com
   - Ensure URLs are valid and accessible (use real URLs, not placeholder URLs)
   - Format URLs properly (https://domain.com/path)

4. The structure should be comprehensive - don't just list topics, break them down deeply. For example, "React" should not be a single node. It should have "React Fundamentals" → "Components" → "Functional Components" → "JSX" → "JSX Expressions", etc.

5. Each description should explain:
   - What the topic is
   - Why it's important
   - How it connects to other topics
   - What you'll learn

Return ONLY valid JSON in this exact format:
{
  "title": "Roadmap Title",
  "description": "Overall description of the learning path",
  "topics": [
    {
      "id": "topic-1",
      "title": "Topic Name",
      "description": "Detailed explanation (2-3 sentences minimum) of what this topic is, why it matters, and how it fits into the learning journey.",
      "level": "beginner",
      "estimatedHours": 10,
      "resources": [
        {"title": "Official Documentation", "url": "https://example.com/docs", "type": "documentation"},
        {"title": "Interactive Tutorial", "url": "https://example.com/tutorial", "type": "tutorial"},
        {"title": "Video Course", "url": "https://example.com/course", "type": "video"}
      ],
      "children": [
        {
          "id": "subtopic-1-1",
          "title": "Subtopic Name",
          "description": "Detailed explanation of this subtopic...",
          "level": "beginner",
          "estimatedHours": 5,
          "resources": [
            {"title": "Resource Name", "url": "https://...", "type": "documentation"}
          ],
          "children": [
            {
              "id": "subtopic-1-1-1",
              "title": "Deep Subtopic",
              "description": "Even more detailed explanation...",
              "level": "beginner",
              "estimatedHours": 3,
              "resources": [...],
              "children": [
                {
                  "id": "subtopic-1-1-1-1",
                  "title": "Very Deep Subtopic",
                  "description": "Most detailed explanation...",
                  "level": "intermediate",
                  "estimatedHours": 2,
                  "resources": [...],
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

IMPORTANT: Ensure the JSON is valid and the structure goes at least 4 levels deep. Each level should have meaningful children.`

    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
      throw new Error('Groq API key is not configured. Please set GROQ_API_KEY in your .env file.')
    }

    const completion = await client.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Create a detailed learning roadmap for: ${prompt}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    })

    const text = completion.choices[0]?.message?.content || ''
    
    if (!text) {
      throw new Error('No response received from Groq API')
    }

    const roadmapData = JSON.parse(text)
    
    const { nodes, edges, topicMap } = convertToFlowStructure(roadmapData)
    
    return {
      ...roadmapData,
      flowData: { nodes, edges },
      topicMap,
    }
  } catch (error) {
    console.error('Error generating roadmap:', error)
    throw new Error(`Failed to generate roadmap: ${error.message}`)
  }
}

function convertToFlowStructure(roadmapData) {
  const nodes = []
  const edges = []
  const topicMap = {}
  let nodeIdCounter = 1
  const levelPositions = {}
  const levelCounts = {}

  function processTopic(topic, parentId = null, level = 0, siblingIndex = 0, totalSiblings = 1) {
    const nodeId = `node-${nodeIdCounter++}`
    
    topicMap[nodeId] = {
      ...topic,
      nodeId,
      parentId,
      level,
    }

    if (!levelPositions[level]) {
      levelPositions[level] = { y: 100 + level * 200, count: 0 }
      levelCounts[level] = 0
    }
    
    const horizontalSpacing = 300
    const x = 250 + level * horizontalSpacing
    
    const verticalSpacing = 180
    const y = levelPositions[level].y + (levelCounts[level] * verticalSpacing)
    
    levelCounts[level]++

    const childCount = topic.children ? topic.children.length : 0

    nodes.push({
      id: nodeId,
      type: 'default',
      data: {
        label: topic.title,
        topicId: topic.id,
        level: topic.level,
        hasChildren: childCount > 0,
        childCount: childCount,
        estimatedHours: topic.estimatedHours,
        parentId: parentId,
      },
      position: { x, y },
    })

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#8a2be2', strokeWidth: 2 },
      })
    }

    if (topic.children && topic.children.length > 0) {
      const childrenCount = topic.children.length
      topic.children.forEach((child, index) => {
        processTopic(child, nodeId, level + 1, index, childrenCount)
      })
    }

    return nodeId
  }

  roadmapData.topics.forEach((topic, index) => {
    processTopic(topic, null, 0, index, roadmapData.topics.length)
  })

  return { nodes, edges, topicMap }
}

export function getTopicDetails(topicMap, nodeId) {
  return topicMap[nodeId] || null
}

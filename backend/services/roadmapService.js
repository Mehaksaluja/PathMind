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
    console.log('Groq AI Adapter initialized with llama-3.3-70b-versatile')
  }
} catch (error) {
  console.error(`Error configuring Groq: ${error.message}`)
}

export async function generateRoadmap(prompt) {
  try {
    const systemPrompt = `You are an expert learning path advisor with years of experience in curriculum design and educational planning. Your task is to create a comprehensive, practical, and well-structured learning roadmap based on the user's learning goal.

CRITICAL QUALITY REQUIREMENTS:

1. ROADMAP STRUCTURE (4-5 levels deep minimum):
   - Level 1: Main learning areas/categories (e.g., "React Fundamentals", "State Management", "Advanced React Patterns")
   - Level 2: Core topics within each area (e.g., "Components", "Hooks", "Context API")
   - Level 3: Specific concepts (e.g., "Functional Components", "useState Hook", "Custom Hooks")
   - Level 4: Detailed subtopics (e.g., "JSX Syntax", "Props and State", "Hook Rules")
   - Level 5: Advanced details (e.g., "PropTypes", "Default Props", "Hook Dependencies")

2. TOPIC QUALITY STANDARDS:
   Each topic MUST have:
   - id: unique, descriptive identifier (e.g., "react-hooks-usestate", "python-oop-classes")
   - title: Clear, specific, and actionable (avoid vague titles like "Basics" or "Introduction")
   - description: 3-4 sentences that explain:
     * What the topic is (clear definition)
     * Why it's important (practical value)
     * How it fits in the learning journey (prerequisites and next steps)
     * What skills/knowledge you'll gain
   - level: Accurately assess as "beginner", "intermediate", or "advanced" based on complexity
   - estimatedHours: Realistic time estimates:
     * Beginner topics: 2-8 hours
     * Intermediate topics: 4-15 hours
     * Advanced topics: 8-25 hours
     * Consider practice time, not just reading/watching
   - resources: 4-6 high-quality, REAL resources:
     * Mix of documentation, tutorials, videos, and courses
     * Prioritize official documentation
     * Include hands-on practice resources
     * Use actual, accessible URLs (no placeholders)
   - children: MUST have children for levels 1-4 (minimum 2-4 children per topic)

3. LEARNING PROGRESSION:
   - Start with fundamentals and prerequisites
   - Build knowledge progressively (each topic should build on previous ones)
   - Group related topics together logically
   - Ensure smooth transitions between topics
   - Include practical projects/application opportunities

4. RESOURCE QUALITY:
   Use REAL, accessible resources:
   - React/JavaScript: react.dev, developer.mozilla.org, javascript.info, freecodecamp.org
   - Python: docs.python.org, realpython.com, python.org, w3schools.com/python
   - Node.js: nodejs.org/docs, expressjs.com, npmjs.com
   - Web Development: web.dev, caniuse.com, css-tricks.com, mdn.dev
   - Data Science: pandas.pydata.org, scikit-learn.org, matplotlib.org
   - Machine Learning: tensorflow.org, pytorch.org, kaggle.com/learn
   - Always use https:// URLs
   - Verify resource titles match actual content

5. CONTENT DEPTH:
   - Don't create shallow roadmaps - break topics down meaningfully
   - Each level should add value and detail
   - Avoid redundancy - each topic should be distinct
   - Ensure comprehensive coverage of the subject

6. PRACTICAL FOCUS:
   - Include hands-on learning opportunities
   - Suggest projects or exercises where appropriate
   - Balance theory with practice
   - Make it actionable and achievable

Return ONLY valid JSON in this exact format (no markdown, no code blocks, just pure JSON):
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

CRITICAL OUTPUT REQUIREMENTS:
- Return ONLY valid JSON (no markdown, no code blocks, no explanations)
- Ensure JSON is properly formatted and parseable
- Structure MUST be at least 4 levels deep
- Each topic at levels 1-4 MUST have 2-4 children minimum
- All descriptions must be meaningful and informative (3-4 sentences)
- All resource URLs must be real and accessible
- Time estimates must be realistic and practical
- The roadmap should be comprehensive enough for someone to actually follow and learn from

Think step by step:
1. Analyze the user's learning goal
2. Break it down into major learning areas
3. For each area, identify core topics
4. For each topic, identify key concepts
5. For each concept, identify important details
6. Ensure logical progression and prerequisites
7. Add high-quality, real resources
8. Provide realistic time estimates

Now create the roadmap JSON:`

    if (!client) {
      throw new Error('Groq API key is not configured. Please set GROQ_API_KEY in your .env file.')
    }

    const chatCompletion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
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
      temperature: 0.3,
      response_format: { type: 'json_object' },
      max_tokens: 8000,
    })

    const text = chatCompletion.choices[0]?.message?.content?.trim() || ''
    
    if (!text) {
      throw new Error('No response received from Groq API')
    }

    // Parse JSON response
    let roadmapData
    try {
      roadmapData = JSON.parse(text)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      console.error('Response text:', text.substring(0, 500))
      throw new Error('Invalid JSON response from AI. Please try again.')
    }

    // Validate roadmap structure
    if (!roadmapData.topics || !Array.isArray(roadmapData.topics) || roadmapData.topics.length === 0) {
      throw new Error('Roadmap must contain at least one topic')
    }

    // Validate and enhance topics
    const validateAndEnhanceTopic = (topic, level = 0) => {
      if (!topic.id) {
        topic.id = `topic-${Math.random().toString(36).substr(2, 9)}`
      }
      if (!topic.title) {
        throw new Error('Topic missing title')
      }
      if (!topic.description || topic.description.length < 50) {
        topic.description = `${topic.title} is an important concept in this learning path. Master this to progress further.`
      }
      if (!topic.level) {
        topic.level = level === 0 ? 'beginner' : level < 2 ? 'beginner' : level < 4 ? 'intermediate' : 'advanced'
      }
      if (!topic.estimatedHours || topic.estimatedHours < 1) {
        topic.estimatedHours = level === 0 ? 10 : level < 2 ? 5 : level < 4 ? 8 : 3
      }
      if (!topic.resources || !Array.isArray(topic.resources) || topic.resources.length === 0) {
        topic.resources = [
          { title: 'Official Documentation', url: 'https://example.com/docs', type: 'documentation' },
          { title: 'Tutorial Guide', url: 'https://example.com/tutorial', type: 'tutorial' }
        ]
      }
      if (topic.children && Array.isArray(topic.children)) {
        topic.children = topic.children.map(child => validateAndEnhanceTopic(child, level + 1))
      }
      return topic
    }

    roadmapData.topics = roadmapData.topics.map(topic => validateAndEnhanceTopic(topic, 0))

    // Ensure title and description exist
    if (!roadmapData.title) {
      roadmapData.title = 'Learning Roadmap'
    }
    if (!roadmapData.description) {
      roadmapData.description = 'A comprehensive learning path to master your goals.'
    }
    
    const { nodes, edges, topicMap } = convertToFlowStructure(roadmapData)
    
    return {
      ...roadmapData,
      flowData: { nodes, edges },
      topicMap,
    }
  } catch (error) {
    console.error(`Error generating text with Groq: ${error.message}`)
    throw new Error(`Failed to generate roadmap: ${error.message}`)
  }
}

function convertToFlowStructure(roadmapData) {
  const nodes = []
  const edges = []
  const topicMap = {}
  let nodeIdCounter = 1
  
  // Better layout configuration
  const VERTICAL_SPACING = 200  // Space between levels (top to bottom)
  const HORIZONTAL_SPACING = 280  // Space between siblings
  const START_Y = 100  // Starting Y position for root nodes
  const START_X = 400  // Starting X position for root nodes

  // Track positions for each level
  const levelYPositions = {}
  const levelXCounters = {}

  function calculateNodePosition(level, siblingIndex, totalSiblings, parentX = null) {
    // Calculate Y position based on level (top to bottom flow)
    if (!levelYPositions[level]) {
      levelYPositions[level] = START_Y + (level * VERTICAL_SPACING)
      levelXCounters[level] = 0
    }

    const y = levelYPositions[level]

    // Calculate X position
    let x
    if (level === 0) {
      // Root nodes: distribute evenly
      const totalWidth = (totalSiblings - 1) * HORIZONTAL_SPACING
      const startX = START_X - (totalWidth / 2)
      x = startX + (siblingIndex * HORIZONTAL_SPACING)
    } else if (parentX !== null) {
      // Child nodes: center them under parent
      const childrenWidth = (totalSiblings - 1) * HORIZONTAL_SPACING
      const startX = parentX - (childrenWidth / 2)
      x = startX + (siblingIndex * HORIZONTAL_SPACING)
    } else {
      // Fallback
      x = START_X + (levelXCounters[level] * HORIZONTAL_SPACING)
      levelXCounters[level]++
    }

    return { x, y }
  }

  function processTopic(topic, parentId = null, level = 0, siblingIndex = 0, totalSiblings = 1, parentX = null) {
    const nodeId = `node-${nodeIdCounter++}`
    
    const childCount = topic.children ? topic.children.length : 0
    
    // Calculate position for this node
    const position = calculateNodePosition(level, siblingIndex, totalSiblings, parentX)
    
    topicMap[nodeId] = {
      ...topic,
      nodeId,
      parentId,
      level,
    }

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
      position: position,
    })

    // Create edge from parent to this node
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

    // Process children
    if (topic.children && topic.children.length > 0) {
      const childrenCount = topic.children.length
      topic.children.forEach((child, index) => {
        processTopic(child, nodeId, level + 1, index, childrenCount, position.x)
      })
    }

    return nodeId
  }

  // Process all root topics
  roadmapData.topics.forEach((topic, index) => {
    processTopic(topic, null, 0, index, roadmapData.topics.length, null)
  })

  return { nodes, edges, topicMap }
}

export function getTopicDetails(topicMap, nodeId) {
  return topicMap[nodeId] || null
}

import Groq from 'groq-sdk'
import { SYSTEM_PROMPT } from '../src/data/chatbot-context.js'

const candidateModels = [
  'groq/compound-mini',
  'groq/compound',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.6-27b',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key missing in environment variables.' })
  }

  try {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        // use raw body
      }
    }

    const { messages } = body || {}
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid payload: messages array required' })
    }

    // Sanitize conversation history
    const groqHistory = messages
      .slice(-10) // Limit context to last 10 messages for safety & quota
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content).slice(0, 1000), // Max 1000 chars per message
      }))

    const groq = new Groq({ apiKey })

    let replyContent = null
    let lastError = null

    for (const model of candidateModels) {
      try {
        const completion = await groq.chat.completions.create({
          model: model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...groqHistory,
          ],
          max_tokens: 450,
          temperature: 0.7,
        })
        replyContent = completion.choices[0]?.message?.content
        if (replyContent) break
      } catch (err) {
        console.warn(`Server: Groq model ${model} failed, trying next...`, err.message)
        lastError = err
      }
    }

    if (!replyContent) {
      throw lastError || new Error('No response generated from Groq models.')
    }

    return res.status(200).json({ reply: replyContent })
  } catch (error) {
    console.error('API /api/chat error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

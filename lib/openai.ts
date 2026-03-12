import OpenAI from 'openai'
import type { GeneratedItinerary, GenerateItineraryRequest } from './types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateItinerary(
  req: GenerateItineraryRequest
): Promise<GeneratedItinerary> {
  const { destination, days, budget, interests } = req

  const budgetClause = budget
    ? `Budget: ${budget} per day`
    : 'Budget: flexible'

  const prompt = `Generate a detailed ${days}-day travel itinerary for ${destination}.

${budgetClause}
Interests: ${interests.length > 0 ? interests.join(', ') : 'General sightseeing'}

Rules:
- Each day has morning, afternoon, and evening activities.
- Each activity is a real, specific place in ${destination}.
- Tailor recommendations to the stated interests and budget.
- Hotel prices should reflect the budget level if provided.

Return ONLY valid JSON (no markdown, no code blocks) matching this exact schema:
{
  "itinerary": [
    {
      "day": 1,
      "morning":   { "place_name": "...", "description": "...", "estimated_time": "..." },
      "afternoon": { "place_name": "...", "description": "...", "estimated_time": "..." },
      "evening":   { "place_name": "...", "description": "...", "estimated_time": "..." }
    }
  ],
  "hotels": [
    { "name": "...", "approx_price": "...", "rating": 4.5, "area": "..." }
  ]
}

Generate exactly ${days} day objects and 4 hotel suggestions.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  })

  const content = completion.choices[0].message.content
  if (!content) throw new Error('Empty response from OpenAI')

  const parsed = JSON.parse(content) as GeneratedItinerary

  if (!parsed.itinerary || !Array.isArray(parsed.itinerary)) {
    throw new Error('Invalid itinerary structure returned by AI')
  }
  if (!parsed.hotels || !Array.isArray(parsed.hotels)) {
    throw new Error('Invalid hotels structure returned by AI')
  }

  return parsed
}

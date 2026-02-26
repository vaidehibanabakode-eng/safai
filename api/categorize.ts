import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CategorizeBody {
  description: string;
  language: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content: { parts: Array<{ text: string }> };
  }>;
  error?: { message: string };
}

const CATEGORIES = [
  'Waste Management',
  'Road Damage',
  'Street Lighting',
  'Drainage/Sewage',
  'Public Property Damage',
  'Water Supply',
  'Noise Pollution',
  'Other',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { description, language } = req.body as CategorizeBody;
  if (!description || description.trim().length < 5) {
    return res.status(400).json({ error: 'Description too short' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const prompt = `You are a municipal complaint classifier for an Indian city management app.
Given the complaint description below (may be in ${language} language), respond with ONLY valid JSON and nothing else.
JSON format: { "category": "<category>", "confidence": <0.0-1.0>, "reason": "<5 words max>" }
Valid categories: ${CATEGORIES.join(', ')}
Complaint: "${description.trim()}"`;

  try {
    const gcpRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 100 },
      }),
    });

    const data = (await gcpRes.json()) as GeminiResponse;
    if (!gcpRes.ok || data.error) {
      console.error('[categorize] Gemini error:', data.error);
      return res.status(500).json({ error: data.error?.message ?? 'Gemini request failed' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    // Strip markdown code fences if present
    const clean = text.replace(/```json?|```/g, '').trim();
    const parsed = JSON.parse(clean) as { category: string; confidence: number; reason: string };

    // Validate category is one of the known ones
    if (!CATEGORIES.includes(parsed.category)) parsed.category = 'Other';
    parsed.confidence = Math.min(1, Math.max(0, Number(parsed.confidence) || 0.5));

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('[categorize] Error:', err);
    return res.status(500).json({ error: 'Categorization failed' });
  }
}

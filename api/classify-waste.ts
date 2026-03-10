import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

interface ClassifyWasteBody {
  imageBase64: string;
  mimeType?: string;
}

export interface WasteClassification {
  wasteType: string;
  category: 'Dry Waste' | 'Wet Waste' | 'Hazardous Waste' | 'Sanitary Waste' | 'E-Waste' | 'Unknown';
  bin: string;
  binColor: string;
  recyclable: boolean;
  instructions: string;
  confidence: number;
}

const VALID_CATEGORIES = ['Dry Waste', 'Wet Waste', 'Hazardous Waste', 'Sanitary Waste', 'E-Waste', 'Unknown'];

const prompt = `You are a waste segregation assistant for an Indian municipal waste management app.
Look at this image and classify the waste item shown.
Respond with ONLY valid JSON and nothing else.

JSON format:
{
  "wasteType": "<specific item name, e.g. 'Plastic Bottle', 'Banana Peel', 'Old Phone'>",
  "category": "<one of: Dry Waste | Wet Waste | Hazardous Waste | Sanitary Waste | E-Waste | Unknown>",
  "bin": "<bin name, e.g. 'Blue Bin', 'Green Bin', 'Red Bin', 'Black Bin', 'E-Waste Collection'>",
  "binColor": "<CSS hex color: #3B82F6 for blue, #22C55E for green, #EF4444 for red, #374151 for black, #F59E0B for e-waste>",
  "recyclable": <true or false>,
  "instructions": "<one actionable sentence on how to dispose, max 20 words>",
  "confidence": <0.0 to 1.0>
}

Category guide (Indian standard):
- Dry Waste → Blue Bin: paper, cardboard, plastic, metal, glass, tetra packs
- Wet Waste → Green Bin: food scraps, vegetable/fruit peels, garden waste, cooked food
- Hazardous Waste → Red Bin: batteries, chemicals, paint, medicines, syringes, CFL bulbs
- Sanitary Waste → Black Bin: diapers, sanitary pads, bandages, medical waste
- E-Waste → E-Waste Collection Point: phones, computers, chargers, cables, electronics

If the image is not waste or unclear, use category "Unknown" with confidence below 0.3.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageBase64, mimeType = 'image/jpeg' } = req.body as ClassifyWasteBody;
  if (!imageBase64) return res.status(400).json({ error: 'Missing imageBase64' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
                detail: 'low',
              },
            },
          ],
        },
      ],
    });

    const text = response.choices[0]?.message?.content ?? '';
    const clean = text.replace(/```json?|```/g, '').trim();
    const parsed = JSON.parse(clean) as WasteClassification;

    if (!VALID_CATEGORIES.includes(parsed.category)) parsed.category = 'Unknown';
    parsed.confidence = Math.min(1, Math.max(0, Number(parsed.confidence) || 0.5));
    parsed.recyclable = Boolean(parsed.recyclable);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('[classify-waste] Error:', err);
    return res.status(500).json({ error: 'Waste classification failed' });
  }
}

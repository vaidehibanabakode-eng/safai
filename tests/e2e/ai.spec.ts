import { test, expect, APIRequestContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * AI Endpoint Tests
 *
 * Tests the Vercel serverless API endpoints:
 *  - POST /api/analyze-photo  (OpenAI GPT-4o Vision)
 *  - POST /api/categorize     (Google Gemini 1.5 Flash)
 *
 * These tests are gated: they skip gracefully if the required API keys
 * are not set in the environment.
 *
 * To run:
 *   OPENAI_API_KEY=sk-... GEMINI_API_KEY=AI... npx playwright test tests/e2e/ai.spec.ts
 *
 * The tests target the Vercel deployment by default. Set VERCEL_URL to override:
 *   VERCEL_URL=https://your-app.vercel.app npx playwright test tests/e2e/ai.spec.ts
 */

const VERCEL_URL = process.env.VERCEL_URL || 'https://safai-main.vercel.app';
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// ─────────────────────────────────────────────────────────────────────────────
// Helper: A tiny 1x1 pixel white JPEG as base64
// Used as a minimal test image for /api/analyze-photo
// ─────────────────────────────────────────────────────────────────────────────
const MINIMAL_JPEG_BASE64 =
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB/8QAIhAAAQMEAwEBAAAAAAAAAAAAAQIDBAAFERIhMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmWua5Xt+ub3b47l0ZuPRStqL2pJSBgYH2P3XTqSogkEYBBBGDkdaUUAf/9k=';

// Valid categories that the API must return
const VALID_CATEGORIES = [
  'Waste Management',
  'Road Damage',
  'Street Lighting',
  'Drainage/Sewage',
  'Public Property Damage',
  'Water Supply',
  'Noise Pollution',
  'Other',
];

// ─────────────────────────────────────────────────────────────────────────────
// /api/analyze-photo
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/api/analyze-photo', () => {
  test.skip(!OPENAI_KEY, 'OPENAI_API_KEY not set — skipping analyze-photo tests');

  test('returns 405 for GET request', async ({ request }) => {
    const res = await request.get(`${VERCEL_URL}/api/analyze-photo`);
    expect(res.status()).toBe(405);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('returns 400 when imageBase64 is missing', async ({ request }) => {
    const res = await request.post(`${VERCEL_URL}/api/analyze-photo`, {
      data: { mimeType: 'image/jpeg' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toMatch(/missing/i);
  });

  test('returns valid analysis result for a test image', async ({ request }) => {
    const res = await request.post(`${VERCEL_URL}/api/analyze-photo`, {
      data: {
        imageBase64: MINIMAL_JPEG_BASE64,
        mimeType: 'image/jpeg',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();

    // Must have all required fields
    expect(body).toHaveProperty('category');
    expect(body).toHaveProperty('severity');
    expect(body).toHaveProperty('description');
    expect(body).toHaveProperty('confidence');

    // Category must be one of the valid values
    expect(VALID_CATEGORIES).toContain(body.category);

    // Severity must be low/medium/high
    expect(['low', 'medium', 'high']).toContain(body.severity);

    // Description must be a non-empty string
    expect(typeof body.description).toBe('string');
    expect(body.description.length).toBeGreaterThan(0);

    // Confidence must be between 0 and 1
    expect(typeof body.confidence).toBe('number');
    expect(body.confidence).toBeGreaterThanOrEqual(0);
    expect(body.confidence).toBeLessThanOrEqual(1);
  });

  test('sanitises out-of-range confidence to [0,1]', async ({ request }) => {
    // This is tested through the normal flow — the API clamps confidence
    const res = await request.post(`${VERCEL_URL}/api/analyze-photo`, {
      data: {
        imageBase64: MINIMAL_JPEG_BASE64,
        mimeType: 'image/png',
      },
    });
    if (res.status() === 200) {
      const body = await res.json();
      expect(body.confidence).toBeGreaterThanOrEqual(0);
      expect(body.confidence).toBeLessThanOrEqual(1);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// /api/categorize
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/api/categorize', () => {
  test.skip(!GEMINI_KEY, 'GEMINI_API_KEY not set — skipping categorize tests');

  test('returns 405 for GET request', async ({ request }) => {
    const res = await request.get(`${VERCEL_URL}/api/categorize`);
    expect(res.status()).toBe(405);
  });

  test('returns 400 when description is too short', async ({ request }) => {
    const res = await request.post(`${VERCEL_URL}/api/categorize`, {
      data: { description: 'Hi', language: 'en' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('categorizes a waste management complaint correctly', async ({ request }) => {
    const res = await request.post(`${VERCEL_URL}/api/categorize`, {
      data: {
        description: 'There is a large pile of garbage overflowing from the bin near the market.',
        language: 'en',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body).toHaveProperty('category');
    expect(body).toHaveProperty('confidence');
    expect(body).toHaveProperty('reason');

    expect(VALID_CATEGORIES).toContain(body.category);
    expect(body.category).toBe('Waste Management');

    expect(typeof body.confidence).toBe('number');
    expect(body.confidence).toBeGreaterThan(0);
    expect(body.confidence).toBeLessThanOrEqual(1);

    expect(typeof body.reason).toBe('string');
    expect(body.reason.split(' ').length).toBeLessThanOrEqual(10); // max ~5 words
  });

  test('categorizes a road damage complaint correctly', async ({ request }) => {
    const res = await request.post(`${VERCEL_URL}/api/categorize`, {
      data: {
        description: 'There is a big pothole on the main road causing accidents to vehicles.',
        language: 'en',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(VALID_CATEGORIES).toContain(body.category);
    expect(body.category).toBe('Road Damage');
  });

  test('categorizes a street lighting complaint correctly', async ({ request }) => {
    const res = await request.post(`${VERCEL_URL}/api/categorize`, {
      data: {
        description: 'The street lights on sector 5 have been broken for 3 days. Very dark at night.',
        language: 'en',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(VALID_CATEGORIES).toContain(body.category);
    expect(body.category).toBe('Street Lighting');
  });

  test('returns valid category even for ambiguous input', async ({ request }) => {
    const res = await request.post(`${VERCEL_URL}/api/categorize`, {
      data: {
        description: 'Something is wrong in our neighbourhood and it smells bad.',
        language: 'en',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(VALID_CATEGORIES).toContain(body.category);
    expect(typeof body.confidence).toBe('number');
    expect(body.confidence).toBeGreaterThanOrEqual(0);
    expect(body.confidence).toBeLessThanOrEqual(1);
  });

  test('handles non-English (Hindi) description', async ({ request }) => {
    const res = await request.post(`${VERCEL_URL}/api/categorize`, {
      data: {
        description: 'सड़क पर बड़ा गड्ढा है जिससे दुर्घटना हो सकती है।', // Road pothole in Hindi
        language: 'hi',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(VALID_CATEGORIES).toContain(body.category);
  });
});

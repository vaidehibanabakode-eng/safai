import { test, expect } from '@playwright/test';

/**
 * API Endpoint Tests — All Vercel Serverless Functions
 *
 * Covers:
 *   /api/analyze-photo  (OpenAI GPT-4o Vision)
 *   /api/notify          (Firebase Cloud Messaging)
 *   /api/transcribe      (Google Cloud Speech-to-Text)
 *
 * Locally the tests hit a lightweight mock server (tests/api-server.ts)
 * that validates the same request contracts as the real handlers and
 * returns deterministic mock responses.
 *
 * Start the server first:  npx tsx tests/api-server.ts
 * Then run tests:          npx playwright test tests/e2e/api.spec.ts
 *
 * To test against a real deployment instead:
 *   API_TEST_URL=https://your-app.vercel.app npx playwright test tests/e2e/api.spec.ts
 */

const BASE = process.env.API_TEST_URL || `http://localhost:${process.env.API_TEST_PORT || 3099}`;

// ── Shared helpers ───────────────────────────────────────────────────────────

/** Tiny 1×1 white JPEG encoded as base64 — minimal valid image */
const MINIMAL_JPEG_BASE64 =
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB/8QAIhAAAQMEAwEBAAAAAAAAAAAAAQIDBAAFERIhMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmWua5Xt+ub3b47l0ZuPRStqL2pJSBgYH2P3XTqSogkEYBBBGDkdaUUAf/9k=';

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

// Minimal valid WebM-Opus audio — silence, ~0.1s (base64)
// Generated via: ffmpeg -f lavfi -i anullsrc=r=48000 -t 0.1 -c:a libopus -f webm pipe:1 | base64
// Fallback: a short base64 placeholder that GCP will accept or reject gracefully
const MINIMAL_AUDIO_BASE64 = 'GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOA';

// ═══════════════════════════════════════════════════════════════════════════
// 1. /api/analyze-photo
// ═══════════════════════════════════════════════════════════════════════════

test.describe('/api/analyze-photo', () => {
  test('rejects GET with 405', async ({ request }) => {
    const res = await request.get(`${BASE}/api/analyze-photo`);
    expect(res.status()).toBe(405);
    const body = await res.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toMatch(/method not allowed/i);
  });

  test('rejects POST without imageBase64 with 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/analyze-photo`, {
      data: { mimeType: 'image/jpeg' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toMatch(/missing/i);
  });

  test('rejects POST with empty body with 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/analyze-photo`, {
      data: {},
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('returns valid analysis for a JPEG image', async ({ request }) => {
    const res = await request.post(`${BASE}/api/analyze-photo`, {
      data: { imageBase64: MINIMAL_JPEG_BASE64, mimeType: 'image/jpeg' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body).toHaveProperty('category');
    expect(body).toHaveProperty('severity');
    expect(body).toHaveProperty('description');
    expect(body).toHaveProperty('confidence');

    expect(VALID_CATEGORIES).toContain(body.category);
    expect(['low', 'medium', 'high']).toContain(body.severity);
    expect(typeof body.description).toBe('string');
    expect(body.description.length).toBeGreaterThan(0);
    expect(body.confidence).toBeGreaterThanOrEqual(0);
    expect(body.confidence).toBeLessThanOrEqual(1);
  });

  test('defaults mimeType to image/jpeg when omitted', async ({ request }) => {
    const res = await request.post(`${BASE}/api/analyze-photo`, {
      data: { imageBase64: MINIMAL_JPEG_BASE64 },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(VALID_CATEGORIES).toContain(body.category);
  });

  test('confidence is clamped to [0, 1]', async ({ request }) => {
    const res = await request.post(`${BASE}/api/analyze-photo`, {
      data: { imageBase64: MINIMAL_JPEG_BASE64 },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.confidence).toBeGreaterThanOrEqual(0);
    expect(body.confidence).toBeLessThanOrEqual(1);
  });

  test('returns a valid category (never an unknown string)', async ({ request }) => {
    const res = await request.post(`${BASE}/api/analyze-photo`, {
      data: { imageBase64: MINIMAL_JPEG_BASE64 },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(VALID_CATEGORIES).toContain(body.category);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. /api/notify
// ═══════════════════════════════════════════════════════════════════════════

test.describe('/api/notify', () => {
  test('rejects GET with 405', async ({ request }) => {
    const res = await request.get(`${BASE}/api/notify`);
    expect(res.status()).toBe(405);
    const body = await res.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toMatch(/method not allowed/i);
  });

  test('rejects POST with empty body with 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/notify`, {
      data: {},
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toMatch(/missing/i);
  });

  test('rejects POST with missing title with 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/notify`, {
      data: { tokens: ['fake-token'], body: 'test body' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('rejects POST with missing body field with 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/notify`, {
      data: { tokens: ['fake-token'], title: 'test title' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('rejects POST with empty tokens array with 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/notify`, {
      data: { tokens: [], title: 'test', body: 'test' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('rejects POST with missing tokens with 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/notify`, {
      data: { title: 'test', body: 'test' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('sends notification and returns success/failure counts', async ({ request }) => {
    const res = await request.post(`${BASE}/api/notify`, {
      data: {
        tokens: ['invalid-fcm-token-for-testing'],
        title: 'Playwright Test',
        body: 'This is an automated test notification',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('successCount');
    expect(body).toHaveProperty('failureCount');
    expect(typeof body.successCount).toBe('number');
    expect(typeof body.failureCount).toBe('number');
  });

  test('handles batch of multiple tokens', async ({ request }) => {
    const res = await request.post(`${BASE}/api/notify`, {
      data: {
        tokens: ['fake-token-1', 'fake-token-2', 'fake-token-3'],
        title: 'Batch Test',
        body: 'Testing multiple tokens',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.successCount + body.failureCount).toBe(3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. /api/transcribe
// ═══════════════════════════════════════════════════════════════════════════

test.describe('/api/transcribe', () => {
  test('rejects GET with 405', async ({ request }) => {
    const res = await request.get(`${BASE}/api/transcribe`);
    expect(res.status()).toBe(405);
    const body = await res.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toMatch(/method not allowed/i);
  });

  test('rejects POST with empty body with 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/transcribe`, {
      data: {},
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toMatch(/missing/i);
  });

  test('rejects POST with missing audio with 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/transcribe`, {
      data: { languageCode: 'hi-IN' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('rejects POST with missing languageCode with 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/transcribe`, {
      data: { audio: MINIMAL_AUDIO_BASE64 },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('returns transcript field for valid audio', async ({ request }) => {
    const res = await request.post(`${BASE}/api/transcribe`, {
      data: {
        audio: MINIMAL_AUDIO_BASE64,
        languageCode: 'en-IN',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('transcript');
    expect(typeof body.transcript).toBe('string');
  });

  test('supports hi-IN language code', async ({ request }) => {
    const res = await request.post(`${BASE}/api/transcribe`, {
      data: {
        audio: MINIMAL_AUDIO_BASE64,
        languageCode: 'hi-IN',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('transcript');
  });

  test('supports mr-IN language code', async ({ request }) => {
    const res = await request.post(`${BASE}/api/transcribe`, {
      data: {
        audio: MINIMAL_AUDIO_BASE64,
        languageCode: 'mr-IN',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('transcript');
  });
});

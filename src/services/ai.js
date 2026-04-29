import { GoogleGenerativeAI } from '@google/generative-ai';

const PARSE_SYSTEM = `You are a nutrition database. Given a natural language food description, return ONLY valid JSON with this exact shape:
{
  "items": [
    { "name": "...", "amount": "...", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
  ],
  "totals": { "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
}
- All macro values are numbers in grams (calories in kcal).
- Handle casual amounts like "a pinch", "a handful", "a slice", "a cup" using typical serving estimates.
- Handle precise amounts like "20g", "100ml", "2 tbsp".
- If something is ambiguous, use a reasonable average.
- Return ONLY the JSON object, no markdown, no explanation.`;

const COACH_SYSTEM = `You are a friendly, concise nutrition coach. Given the user's goals and recent eating data, give ONE short practical tip (2-3 sentences max). Be specific and actionable. No bullet points, no headers.`;

async function callGemini(apiKey, systemPrompt, userMessage) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(`${systemPrompt}\n\nUser: ${userMessage}`);
  return result.response.text();
}

async function callAnthropicProxy(proxyUrl, systemPrompt, userMessage) {
  const res = await fetch(`${proxyUrl}/v1/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

export async function parseMealText(text, settings) {
  const { provider, geminiKey, anthropicProxyUrl } = settings;
  let raw;
  if (provider === 'anthropic') {
    raw = await callAnthropicProxy(anthropicProxyUrl, PARSE_SYSTEM, text);
  } else {
    raw = await callGemini(geminiKey, PARSE_SYSTEM, text);
  }

  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

export async function getCoachTip(settings, todayMacros, recentDays) {
  const { provider, geminiKey, anthropicProxyUrl, mode, goals } = settings;
  const message = `
Goal mode: ${mode}
Daily targets: ${goals.calories} kcal, ${goals.protein}g protein, ${goals.carbs}g carbs, ${goals.fat}g fat
Today so far: ${todayMacros.calories} kcal, ${todayMacros.protein}g protein, ${todayMacros.carbs}g carbs, ${todayMacros.fat}g fat
Last 7 days averages: ${JSON.stringify(recentDays)}
Give a short, specific tip.`;

  if (provider === 'anthropic') {
    return callAnthropicProxy(anthropicProxyUrl, COACH_SYSTEM, message);
  }
  return callGemini(geminiKey, COACH_SYSTEM, message);
}

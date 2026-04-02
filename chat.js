// api/chat.js — Vercel Serverless Function
// This runs on Vercel's servers. Your API key NEVER reaches the browser.
//
// SETUP:
// 1. Create a NEW repo on GitHub (e.g. "abdooo-api")
// 2. Put this file at: api/chat.js
// 3. Go to vercel.com → Import that repo → Deploy
// 4. In Vercel Dashboard → Settings → Environment Variables
//    Add: ANTHROPIC_API_KEY = sk-ant-...
// 5. Copy your Vercel URL (e.g. https://abdooo-api.vercel.app)
// 6. Paste it in index.html where it says YOUR_VERCEL_URL

export default async function handler(req, res) {

  // Allow your GitHub Pages site to call this
  res.setHeader('Access-Control-Allow-Origin', 'https://abderrahmaneoubella.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(404).json({ error: 'Not found' });

  const { messages, system } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing messages' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // secret, server-side only
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // fast + cheap for a chat widget
        max_tokens: 800,
        system: system || '',
        messages,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}

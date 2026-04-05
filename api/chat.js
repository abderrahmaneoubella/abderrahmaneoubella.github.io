export default async function handler(req, res) {
   res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(404).json({ error: 'Not found' });
 
  const { messages, system } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing messages' });
  }
 
  const geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));
 
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system || '' }] },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7,
          }
        }),
      }
    );
 
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas pu répondre. 😅";
    return res.status(200).json({ text });
 
  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}

export default async function handler(req, res) {
  const { messages } = req.body;
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY, // هذا المتغير سنضبطه في إعدادات Vercel
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      system: "You are ABDOOO, the AI assistant for Abderrahmane Oubella...", // ضع تعليماتك هنا
      messages: messages,
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}

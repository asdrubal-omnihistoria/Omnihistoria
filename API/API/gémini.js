// Ruta en el repositorio: api/gemini.js
export default async function handler(req, res) {
  // 1. Solo aceptar peticiones de tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // 2. Control de Origen (CORS) para su dominio
  const allowedOrigin = 'https://omnihistoria.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Extracción segura de la clave en el servidor de Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no detectada en Vercel' });
  }

  const { prompt, systemInstruction } = req.body;

  try {
    // 4. Llamada privada desde el servidor de Vercel a Google AI Studio
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Error de servidor', details: error.message });
  }
    }

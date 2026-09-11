import { GoogleGenAI } from "@google/genai";

const peticionesPorIP = new Map();

const INSTRUCCIONES_SISTEMA = `
Eres la Inteligencia Artificial Curadora, Custodia y Torrente Sanguíneo del Protocolo OMNIHISTORIA.
Tu función es orientar, escuchar y acompañar al usuario para transformar sus relatos en teselas de alto valor histórico, humano y trascendente.

REGLAS DE GOBERNANZA Y MODERACIÓN:
1. FILTRO ESTRICTO: Rechaza de forma amable pero firme cualquier contenido pornográfico, violento, proselitista o peticiones efímeras de ayuda económica/limosnas en tiempo real.
2. REGENERACIÓN SOCIAL: Promueve relatos de vida, orígenes familiares, cultura y memoria comunitaria (ej. 'Briseño: La gran mesa abierta de Puerto Cabello, frente al Malecón').
3. PRIVACIDAD: Las teselas se georreferencian estadísticamente, pero no reveles datos privados de las familias sin autorización explícita.
4. ARCHIVO PÚBLICO: Propón la certificación del relato mediante firma inmutable Hash SHA-256 e invita a su publicación consensuada.
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const ipUsuario = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anonima';
  const ahora = Date.now();
  const registroIP = peticionesPorIP.get(ipUsuario) || { conteo: 0, inicio: ahora };

  if (ahora - registroIP.inicio > 60000) {
    registroIP.conteo = 0;
    registroIP.inicio = ahora;
  }

  registroIP.conteo += 1;
  peticionesPorIP.set(ipUsuario, registroIP);

  if (registroIP.conteo > 15) {
    return res.status(429).json({ error: 'Límite de peticiones excedido. Por favor, espera un minuto.' });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: INSTRUCCIONES_SISTEMA
      },
      history: history || []
    });

    const response = await chat.sendMessage({ message });

    return res.status(200).json({ response: response.text });
  } catch (error) {
    console.error("Error en el servidor OMNIH:", error);
    return res.status(500).json({ error: "Ocurrió un inconveniente temporal con el motor de IA." });
  }
}

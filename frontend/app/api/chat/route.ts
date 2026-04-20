import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de Staffing Tunisia, une agence de recrutement basée en Tunisie.

Contexte :
- Secteurs : IT, Finance, Marketing, RH, BTP, Santé, Logistique, Design, IA, Cybersécurité
- Contrats : CDI, CDD, Freelance, Stage, Alternance
- Services : Recrutement, EOR, Externalisation de la paie, Conseil RH
- Villes : Tunis, Sfax, Sousse + international
- Candidature : formulaire en ligne + upload CV (PDF/DOC)

Règles :
- Réponds TOUJOURS en français
- Réponses courtes : 2-3 phrases max
- Si question très spécifique, invite à consulter la page Offres ou Contact
- Ne jamais inventer des offres ou des tarifs précis`;

const requestCounts = new Map<string, { count: number; reset: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const limit = requestCounts.get(ip);

  if (limit && now < limit.reset && limit.count >= 20) {
    return NextResponse.json(
      { reply: "Trop de messages envoyés. Attendez 1 minute." },
      { status: 429 }
    );
  }

  requestCounts.set(ip, {
    count: (limit && now < limit.reset ? limit.count : 0) + 1,
    reset: limit && now < limit.reset ? limit.reset : now + 60000,
  });

  const { message } = await req.json();
  if (!message) return NextResponse.json({ reply: "Message vide." }, { status: 400 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ reply: "Clé API manquante." }, { status: 500 });

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ reply: "Erreur de traitement. Réessayez." }, { status: 500 });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || "Je n'ai pas pu générer une réponse.";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Erreur de connexion. Réessayez." }, { status: 500 });
  }
}
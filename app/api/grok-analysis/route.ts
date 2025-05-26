import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, data } = await request.json()

    // Qui useresti la vera API di Grok
    // const response = await fetch('https://api.x.ai/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     messages: [
    //       {
    //         role: 'system',
    //         content: 'You are a restaurant business analyst AI. Provide actionable insights based on data.'
    //       },
    //       {
    //         role: 'user',
    //         content: prompt
    //       }
    //     ],
    //     model: 'grok-beta',
    //     stream: false
    //   })
    // })

    // Per ora, restituiamo insights simulati ma realistici
    const insights = [
      {
        type: "opportunity",
        title: "Margine Risotto Sottosfruttato",
        description:
          "Il Risotto ai Funghi ha il margine più alto (67%) ma rappresenta solo il 12% degli ordini totali. C'è potenziale per aumentare significativamente la redditività.",
        impact: "high",
        confidence: 87,
        recommendation:
          "Implementa una strategia di upselling per il risotto: posizionalo come 'Specialità dello Chef' nel menu, offri degustazioni gratuite, e forma il personale per suggerirlo attivamente.",
      },
      {
        type: "warning",
        title: "Inefficienza Orario 22:00-23:00",
        description:
          "Dopo le 22:00 gli ordini calano del 45% ma i costi fissi rimangono. Il rapporto costi/ricavi si deteriora significativamente.",
        impact: "medium",
        confidence: 91,
        recommendation:
          "Considera di ridurre il personale dopo le 22:00 o introduci un 'menu serale ridotto' con piatti a preparazione rapida per mantenere l'efficienza.",
      },
      {
        type: "success",
        title: "Performance Eccezionale Giuseppe",
        description:
          "Giuseppe in cucina mantiene un'efficienza del 96% con tempo medio di 18.5min, superiore agli standard del settore (20-22min).",
        impact: "medium",
        confidence: 95,
        recommendation:
          "Documenta i processi di Giuseppe per standardizzare l'efficienza. Considera di affiancarlo a nuovo personale per il training.",
      },
      {
        type: "prediction",
        title: "Crescita Sostenibile Prevista",
        description:
          "I trend attuali indicano una crescita del 15-20% nei prossimi 30 giorni, ma potrebbero emergere colli di bottiglia in cucina.",
        impact: "high",
        confidence: 83,
        recommendation:
          "Prepara un piano di scaling: pre-ordina ingredienti, considera personale temporaneo per i weekend, e ottimizza i processi di cucina.",
      },
    ]

    return NextResponse.json(insights)
  } catch (error) {
    console.error("Errore API Grok:", error)
    return NextResponse.json({ error: "Errore nell'analisi" }, { status: 500 })
  }
}

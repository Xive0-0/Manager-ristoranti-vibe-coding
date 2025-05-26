import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, query } = await request.json()

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
    //         content: 'You are an expert restaurant consultant. Provide detailed, actionable advice based on the provided data.'
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

    // Simulazione di risposta intelligente basata sulla query
    let response = ""

    if (query.toLowerCase().includes("margine") || query.toLowerCase().includes("profitto")) {
      response = `Analizzando i tuoi dati sui margini:

🎯 **OPPORTUNITÀ IMMEDIATE:**
- Il Risotto ai Funghi ha il margine più alto (67%) ma solo 67 ordini
- Il Tiramisù ha margine eccellente (75%) e buon volume (98 ordini)
- Le pizze hanno volume alto (156 ordini) ma margine migliorabile (60%)

📊 **RACCOMANDAZIONI SPECIFICHE:**
1. **Promuovi il Risotto**: Crea un "Risotto del Giorno" con variazioni stagionali
2. **Ottimizza le Pizze**: Riduci leggermente i costi ingredienti o aumenta prezzi del 5-8%
3. **Espandi i Dessert**: Il Tiramisù performa bene, aggiungi 2-3 dessert simili

💰 **IMPATTO STIMATO**: +12-15% sui margini complessivi implementando queste strategie.`
    } else if (query.toLowerCase().includes("staff") || query.toLowerCase().includes("personale")) {
      response = `Analisi Performance Staff:

⭐ **TOP PERFORMER:**
- Marco: 94% efficienza, 4.8 rating, 16.2min tempo medio
- Giuseppe (cucina): 96% efficienza, gestisce 234 ordini

⚠️ **AREE DI MIGLIORAMENTO:**
- Anna: 87% efficienza, 19.3min tempo medio (vs 16.2 di Marco)

🎯 **STRATEGIE OTTIMIZZAZIONE:**
1. **Mentoring Program**: Marco forma Anna e altri camerieri
2. **Incentivi Performance**: Bonus per efficienza >90%
3. **Cross-training**: Staff polivalente per picchi di lavoro
4. **Scheduling Intelligente**: Marco nei turni di punta (20:00-22:00)

📈 **RISULTATO ATTESO**: +8-10% efficienza generale del team.`
    } else if (query.toLowerCase().includes("vendite") || query.toLowerCase().includes("ricavi")) {
      response = `Analisi Trend Vendite:

📈 **PERFORMANCE ATTUALE:**
- Crescita costante: €2,450 → €3,650 (+49% in 7 giorni)
- Picco ordini: 21:00 (32 ordini, €1,890)
- Scontrino medio: €55.6 (sopra media settore)

🎯 **OPPORTUNITÀ CRESCITA:**
1. **Orario Pre-Cena**: Solo 8 ordini alle 18:00, potenziale aperitivi
2. **Weekend Extension**: Considera apertura domenica pranzo
3. **Delivery/Takeaway**: Mercato non sfruttato

💡 **STRATEGIE IMMEDIATE:**
- Happy Hour 18:00-19:30 con appetizer
- Menu pranzo domenicale per famiglie
- Partnership delivery per ordini esterni

🚀 **PROIEZIONE**: +25-30% ricavi implementando tutte le strategie.`
    } else {
      response = `Basandomi sui tuoi dati operativi, ecco la mia analisi:

📊 **SITUAZIONE ATTUALE:**
- Trend vendite positivo (+18.2% settimana)
- Efficienza operativa buona (92.3% cucina)
- Staff performance solida (rating medio 4.6)

🎯 **RACCOMANDAZIONI PRIORITARIE:**
1. **Ottimizza Menu Mix**: Promuovi piatti ad alto margine
2. **Migliora Efficienza**: Standardizza processi top performer
3. **Espandi Fasce Orarie**: Sfrutta orari sottoutilizzati
4. **Customer Retention**: Programma fedeltà per clienti abituali

📈 **PROSSIMI PASSI:**
- Implementa sistema di tracking KPI giornalieri
- Forma staff su tecniche di upselling
- Analizza feedback clienti per miglioramenti

Per analisi più specifiche, fammi domande dettagliate su aree particolari!`
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Errore query Grok:", error)
    return NextResponse.json({ error: "Errore nel processare la query" }, { status: 500 })
  }
}

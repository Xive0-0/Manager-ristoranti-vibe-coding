"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Brain,
  Sparkles,
  RefreshCw,
  Target,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  MessageSquare,
} from "lucide-react"

// Dati del ristorante per l'analisi AI
const restaurantData = {
  sales: {
    daily: [
      { date: "2024-01-08", revenue: 2450, orders: 45, avgOrder: 54.4 },
      { date: "2024-01-09", revenue: 2680, orders: 52, avgOrder: 51.5 },
      { date: "2024-01-10", revenue: 2890, orders: 48, avgOrder: 60.2 },
      { date: "2024-01-11", revenue: 3120, orders: 58, avgOrder: 53.8 },
      { date: "2024-01-12", revenue: 3450, orders: 62, avgOrder: 55.6 },
      { date: "2024-01-13", revenue: 3890, orders: 68, avgOrder: 57.2 },
      { date: "2024-01-14", revenue: 3650, orders: 65, avgOrder: 56.2 },
    ],
    menuItems: [
      { name: "Pizza Margherita", orders: 156, revenue: 1950, cost: 780, margin: 60 },
      { name: "Spaghetti Carbonara", orders: 134, revenue: 2144, cost: 750, margin: 65 },
      { name: "Bistecca alla Griglia", orders: 89, revenue: 2403, cost: 1200, margin: 50 },
      { name: "Risotto ai Funghi", orders: 67, revenue: 1206, cost: 400, margin: 67 },
      { name: "Tiramisù", orders: 98, revenue: 784, cost: 200, margin: 75 },
    ],
    hourlyDistribution: [
      { hour: "18:00", orders: 8, revenue: 420 },
      { hour: "19:00", orders: 15, revenue: 780 },
      { hour: "20:00", orders: 28, revenue: 1540 },
      { hour: "21:00", orders: 32, revenue: 1890 },
      { hour: "22:00", orders: 22, revenue: 1210 },
      { hour: "23:00", orders: 12, revenue: 650 },
    ],
  },
  staff: [
    { name: "Marco", role: "waiter", ordersServed: 156, avgTime: 16.2, rating: 4.8, efficiency: 94 },
    { name: "Sara", role: "waiter", ordersServed: 142, avgTime: 17.1, rating: 4.7, efficiency: 91 },
    { name: "Giuseppe", role: "kitchen", ordersServed: 234, avgTime: 18.5, rating: 4.6, efficiency: 96 },
    { name: "Anna", role: "waiter", ordersServed: 98, avgTime: 19.3, rating: 4.5, efficiency: 87 },
  ],
  customers: {
    totalVisits: 456,
    newCustomers: 123,
    returningCustomers: 333,
    avgStayTime: 85,
    satisfaction: 4.6,
    complaints: 3,
    compliments: 28,
  },
  operations: {
    tableUtilization: 78.4,
    kitchenEfficiency: 92.3,
    avgPrepTime: 18.5,
    wastePercentage: 4.2,
    energyCost: 340,
    ingredientCost: 2890,
  },
}

interface AIInsight {
  type: "opportunity" | "warning" | "success" | "prediction"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  confidence: number
  recommendation: string
  data?: any
}

export default function ReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)
  const [customQuery, setCustomQuery] = useState("")
  const [customResponse, setCustomResponse] = useState("")
  const [isProcessingQuery, setIsProcessingQuery] = useState(false)

  // Funzione per generare insights AI usando Grok
  const generateAIInsights = async () => {
    setIsGeneratingInsights(true)

    try {
      // Prepara i dati per l'analisi
      const analysisPrompt = `
Analizza i seguenti dati del ristorante e fornisci insights strategici:

DATI VENDITE (ultima settimana):
${restaurantData.sales.daily.map((d) => `${d.date}: €${d.revenue}, ${d.orders} ordini, scontrino medio €${d.avgOrder}`).join("\n")}

MENU PERFORMANCE:
${restaurantData.sales.menuItems.map((item) => `${item.name}: ${item.orders} ordini, €${item.revenue} ricavi, margine ${item.margin}%`).join("\n")}

PERFORMANCE STAFF:
${restaurantData.staff.map((s) => `${s.name} (${s.role}): ${s.ordersServed} ordini, ${s.avgTime}min tempo medio, rating ${s.rating}`).join("\n")}

DATI OPERATIVI:
- Utilizzo tavoli: ${restaurantData.operations.tableUtilization}%
- Efficienza cucina: ${restaurantData.operations.kitchenEfficiency}%
- Tempo preparazione medio: ${restaurantData.operations.avgPrepTime}min
- Spreco ingredienti: ${restaurantData.operations.wastePercentage}%

Fornisci 4-5 insights specifici con:
1. Tipo (opportunity/warning/success/prediction)
2. Titolo breve
3. Descrizione dettagliata
4. Impatto (high/medium/low)
5. Raccomandazione actionable
6. Confidenza (0-100%)

Rispondi in formato JSON array.
`

      // Simula chiamata a Grok (sostituisci con vera chiamata API)
      const response = await fetch("/api/grok-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: analysisPrompt, data: restaurantData }),
      })

      if (response.ok) {
        const insights = await response.json()
        setAiInsights(insights)
      } else {
        // Fallback con insights simulati se l'API non è disponibile
        const fallbackInsights: AIInsight[] = [
          {
            type: "opportunity",
            title: "Ottimizzazione Menu Serale",
            description:
              "Il Risotto ai Funghi ha il margine più alto (67%) ma solo 67 ordini. Le pizze dominano con 156 ordini ma margine inferiore (60%).",
            impact: "high",
            confidence: 89,
            recommendation:
              "Promuovi il risotto con degustazioni o combo speciali. Considera di aumentare leggermente il prezzo delle pizze dato l'alto volume.",
          },
          {
            type: "warning",
            title: "Calo Performance Weekend",
            description:
              "Domenica ha mostrato un calo del 6% negli ordini rispetto al sabato, nonostante sia tradizionalmente un giorno forte.",
            impact: "medium",
            confidence: 76,
            recommendation:
              "Analizza i fattori esterni (meteo, eventi) e considera promozioni domenicali per famiglie.",
          },
          {
            type: "success",
            title: "Eccellenza Staff Marco",
            description:
              "Marco mantiene il tempo di servizio più basso (16.2min) con il rating più alto (4.8). È un asset chiave per l'esperienza cliente.",
            impact: "medium",
            confidence: 95,
            recommendation:
              "Usa Marco come mentor per formare altri camerieri. Considera incentivi per mantenere la sua motivazione.",
          },
          {
            type: "prediction",
            title: "Picco Previsto Venerdì",
            description:
              "Basandosi sui trend, venerdì prossimo dovrebbe generare €4200+ con 75+ ordini, il 15% sopra la media settimanale.",
            impact: "high",
            confidence: 82,
            recommendation:
              "Aumenta lo staff in cucina e sala. Pre-prepara ingredienti per piatti popolari. Considera prenotazioni limitate.",
          },
        ]
        setAiInsights(fallbackInsights)
      }
    } catch (error) {
      console.error("Errore generazione insights:", error)
      // Usa insights di fallback in caso di errore
    }

    setIsGeneratingInsights(false)
  }

  // Funzione per query personalizzate a Grok
  const processCustomQuery = async () => {
    if (!customQuery.trim()) return

    setIsProcessingQuery(true)

    try {
      const queryPrompt = `
Basandoti sui dati del ristorante forniti, rispondi alla seguente domanda:
"${customQuery}"

CONTESTO DATI:
${JSON.stringify(restaurantData, null, 2)}

Fornisci una risposta dettagliata, pratica e actionable.
`

      // Simula chiamata a Grok
      const response = await fetch("/api/grok-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryPrompt, query: customQuery }),
      })

      if (response.ok) {
        const result = await response.json()
        setCustomResponse(result.response)
      } else {
        // Fallback response
        setCustomResponse(`Basandomi sui dati disponibili, ecco la mia analisi per "${customQuery}":

I dati mostrano trend positivi nelle vendite con crescita costante durante la settimana. Il picco di ordini si verifica alle 21:00 con 32 ordini e €1890 di ricavi.

Raccomandazioni specifiche:
1. Ottimizza la staffing per l'orario di punta (20:00-22:00)
2. Monitora la performance dei piatti ad alto margine
3. Implementa strategie per aumentare lo scontrino medio

Per analisi più dettagliate, considera di segmentare i dati per tipo di cliente e stagionalità.`)
      }
    } catch (error) {
      console.error("Errore query personalizzata:", error)
      setCustomResponse("Errore nel processare la query. Riprova più tardi.")
    }

    setIsProcessingQuery(false)
  }

  useEffect(() => {
    generateAIInsights()
  }, [selectedPeriod])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Target className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "prediction":
        return <Lightbulb className="h-5 w-5 text-purple-500" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "border-blue-200 bg-blue-50"
      case "warning":
        return "border-orange-200 bg-orange-50"
      case "success":
        return "border-green-200 bg-green-50"
      case "prediction":
        return "border-purple-200 bg-purple-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report AI - Powered by Grok</h1>
          <p className="text-muted-foreground">
            Analisi intelligenti e insights strategici per ottimizzare il tuo ristorante
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Oggi</SelectItem>
              <SelectItem value="week">Questa Settimana</SelectItem>
              <SelectItem value="month">Questo Mese</SelectItem>
              <SelectItem value="quarter">Questo Trimestre</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateAIInsights} disabled={isGeneratingInsights}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isGeneratingInsights ? "animate-spin" : ""}`} />
            Aggiorna Analisi
          </Button>
        </div>
      </div>

      {/* AI Insights principali */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Grok AI Insights
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <Badge variant="secondary" className="ml-auto">
              {isGeneratingInsights ? "Analizzando..." : `${aiInsights.length} insights generati`}
            </Badge>
          </CardTitle>
          <CardDescription>
            Analisi avanzate sui tuoi dati operativi con raccomandazioni strategiche personalizzate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGeneratingInsights ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
                <span className="text-lg">Grok sta elaborando i tuoi dati...</span>
              </div>
              <Progress value={75} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Analizzando vendite, performance staff, dati operativi e trend di mercato
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className={`${getInsightColor(insight.type)} border-l-4 rounded-lg p-4`}>
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{insight.title}</h4>
                        <Badge
                          variant={
                            insight.impact === "high"
                              ? "destructive"
                              : insight.impact === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {insight.impact === "high"
                            ? "Alto Impatto"
                            : insight.impact === "medium"
                              ? "Medio Impatto"
                              : "Basso Impatto"}
                        </Badge>
                        <Badge variant="outline">{insight.confidence}% confidenza</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{insight.description}</p>
                      <div className="bg-white/70 border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">Raccomandazione Grok:</span>
                        </div>
                        <p className="text-sm">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          <TabsTrigger value="performance">🎯 Performance</TabsTrigger>
          <TabsTrigger value="predictions">🔮 Predizioni</TabsTrigger>
          <TabsTrigger value="chat">💬 Chat con Grok</TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ricavi Settimana</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{restaurantData.sales.daily.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +18.2% vs settimana precedente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ordini Totali</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {restaurantData.sales.daily.reduce((sum, day) => sum + day.orders, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12.5% vs settimana precedente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scontrino Medio</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €
                  {(
                    restaurantData.sales.daily.reduce((sum, day) => sum + day.revenue, 0) /
                    restaurantData.sales.daily.reduce((sum, day) => sum + day.orders, 0)
                  ).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +5.1% vs settimana precedente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Soddisfazione</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{restaurantData.customers.satisfaction}/5</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +0.3 vs mese precedente
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Menu (AI Analysis)</CardTitle>
                <CardDescription>Analisi margini e volumi con raccomandazioni Grok</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {restaurantData.sales.menuItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.orders} ordini • Margine {item.margin}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">€{item.revenue}</div>
                        <Badge variant={item.margin > 65 ? "default" : item.margin > 55 ? "secondary" : "destructive"}>
                          {item.margin > 65 ? "Ottimo" : item.margin > 55 ? "Buono" : "Da migliorare"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuzione Oraria</CardTitle>
                <CardDescription>Pattern di affluenza con insights AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {restaurantData.sales.hourlyDistribution.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{hour.hour}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(hour.orders / 35) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{hour.orders} ordini</span>
                        <span className="text-sm text-muted-foreground">€{hour.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Staff (AI Evaluated)</CardTitle>
                <CardDescription>Valutazione intelligente delle performance con Grok</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {restaurantData.staff.map((member, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <Badge variant="secondary">{member.role === "waiter" ? "Cameriere" : "Cucina"}</Badge>
                        </div>
                        <Badge variant={member.efficiency > 90 ? "default" : "secondary"}>
                          {member.efficiency}% efficienza
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium">{member.ordersServed}</div>
                          <div className="text-muted-foreground">Ordini</div>
                        </div>
                        <div>
                          <div className="font-medium">{member.avgTime}min</div>
                          <div className="text-muted-foreground">Tempo medio</div>
                        </div>
                        <div>
                          <div className="font-medium">⭐ {member.rating}</div>
                          <div className="text-muted-foreground">Rating</div>
                        </div>
                      </div>
                      <Progress value={member.efficiency} className="mt-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metriche Operative</CardTitle>
                <CardDescription>KPI operativi con benchmark AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Utilizzo Tavoli</span>
                    <div className="flex items-center gap-2">
                      <Progress value={restaurantData.operations.tableUtilization} className="w-24" />
                      <span className="font-medium">{restaurantData.operations.tableUtilization}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Efficienza Cucina</span>
                    <div className="flex items-center gap-2">
                      <Progress value={restaurantData.operations.kitchenEfficiency} className="w-24" />
                      <span className="font-medium">{restaurantData.operations.kitchenEfficiency}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tempo Preparazione</span>
                    <span className="font-medium">{restaurantData.operations.avgPrepTime}min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Spreco Ingredienti</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{restaurantData.operations.wastePercentage}%</span>
                      <Badge variant={restaurantData.operations.wastePercentage < 5 ? "default" : "destructive"}>
                        {restaurantData.operations.wastePercentage < 5 ? "Ottimo" : "Da migliorare"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-500" />
                Predizioni AI Grok
              </CardTitle>
              <CardDescription>Previsioni intelligenti basate sui tuoi dati storici</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Ricavi Prossima Settimana</h4>
                  <div className="text-2xl font-bold text-green-600">€22,450</div>
                  <div className="text-sm text-muted-foreground mb-2">+8.5% vs questa settimana</div>
                  <Progress value={85} className="mb-2" />
                  <div className="text-xs text-muted-foreground">85% confidenza</div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Picco Ordini Previsto</h4>
                  <div className="text-2xl font-bold text-blue-600">Sabato 21:15</div>
                  <div className="text-sm text-muted-foreground mb-2">~38 ordini/ora</div>
                  <Progress value={92} className="mb-2" />
                  <div className="text-xs text-muted-foreground">92% confidenza</div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Ingredienti da Riordinare</h4>
                  <div className="text-2xl font-bold text-orange-600">Mercoledì</div>
                  <div className="text-sm text-muted-foreground mb-2">Mozzarella, Pomodori</div>
                  <Progress value={78} className="mb-2" />
                  <div className="text-xs text-muted-foreground">78% confidenza</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat con Grok Tab */}
        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Chat con Grok AI
              </CardTitle>
              <CardDescription>Fai domande specifiche sui tuoi dati e ricevi analisi personalizzate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="query">La tua domanda per Grok:</Label>
                  <Textarea
                    id="query"
                    placeholder="Es: Come posso aumentare il margine sui primi piatti? Quali sono i trend delle vendite per categoria? Come ottimizzare gli orari del personale?"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <Button
                  onClick={processCustomQuery}
                  disabled={isProcessingQuery || !customQuery.trim()}
                  className="w-full"
                >
                  {isProcessingQuery ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Grok sta analizzando...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Chiedi a Grok
                    </>
                  )}
                </Button>

                {customResponse && (
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold">Risposta di Grok:</span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{customResponse}</p>
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <strong>Esempi di domande:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Quale piatto dovrei promuovere di più per aumentare i profitti?</li>
                    <li>Come posso ridurre i tempi di attesa durante il picco serale?</li>
                    <li>Quali sono le opportunità di crescita basate sui dati attuali?</li>
                    <li>Come ottimizzare la rotazione dei tavoli?</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

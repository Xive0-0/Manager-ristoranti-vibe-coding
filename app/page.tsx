"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, Clock, ChefHat, TrendingUp, Calendar, MapPin, Receipt } from "lucide-react"

// Mock data per la dashboard
const dashboardStats = {
  totalTables: 24,
  occupiedTables: 18,
  dailyRevenue: 2847.5,
  activeOrders: 12,
  avgServiceTime: 28,
  todayReservations: 34,
}

const recentOrders = [
  { id: "ORD-001", table: 5, items: ["Margherita", "Carbonara"], total: 28.5, status: "preparing" },
  { id: "ORD-002", table: 12, items: ["Antipasto", "Bistecca"], total: 45.0, status: "ready" },
  { id: "ORD-003", table: 8, items: ["Tiramisù", "Caffè"], total: 12.0, status: "served" },
  { id: "ORD-004", table: 3, items: ["Pizza Diavola"], total: 15.5, status: "preparing" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "preparing":
      return "bg-yellow-500"
    case "ready":
      return "bg-green-500"
    case "served":
      return "bg-blue-500"
    case "paid":
      return "bg-gray-500"
    default:
      return "bg-gray-400"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "preparing":
      return "In Preparazione"
    case "ready":
      return "Pronto"
    case "served":
      return "Servito"
    case "paid":
      return "Pagato"
    default:
      return "Sconosciuto"
  }
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Aggiorna l'ora ogni minuto
  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Panoramica generale del ristorante -{" "}
            {currentTime.toLocaleDateString("it-IT", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold">
            {currentTime.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="text-sm text-muted-foreground">Ora corrente</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tavoli Occupati</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.occupiedTables}/{dashboardStats.totalTables}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((dashboardStats.occupiedTables / dashboardStats.totalTables) * 100)}% di occupazione
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incasso Giornaliero</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{dashboardStats.dailyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% rispetto a ieri
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordini Attivi</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeOrders}</div>
            <p className="text-xs text-muted-foreground">In cucina e in preparazione</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Medio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.avgServiceTime}min</div>
            <p className="text-xs text-muted-foreground">Tempo di servizio medio</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Ordini Recenti */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Ordini Recenti
            </CardTitle>
            <CardDescription>Ultimi ordini in tempo reale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Tavolo {order.table}</span>
                    </div>
                    <Badge variant="secondary" className={`${getStatusColor(order.status)} text-white`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">€{order.total.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">{order.items.join(", ")}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Azioni Rapide</CardTitle>
            <CardDescription>Operazioni frequenti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Gestione Tavoli
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ChefHat className="mr-2 h-4 w-4" />
                Nuovo Ordine
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Prenotazioni
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                Menu Digitale
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Report Giornaliero
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Sistema Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Cucina Attiva</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>{dashboardStats.activeOrders} ordini in coda</span>
              </div>
            </div>
            <div className="text-muted-foreground">Ultimo aggiornamento: {currentTime.toLocaleTimeString("it-IT")}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

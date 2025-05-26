"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChefHat, Clock, CheckCircle, AlertCircle, MapPin, User, StickyNote, Timer, Utensils } from "lucide-react"

// Tipi per la cucina
interface KitchenOrderItem {
  id: string
  name: string
  quantity: number
  notes?: string
  category: string
  preparationTime: number
  allergens: string[]
}

interface KitchenOrder {
  id: string
  tableNumber: number
  items: KitchenOrderItem[]
  status: "preparing" | "ready" | "served"
  waiter: string
  createdAt: Date
  estimatedTime: number
  priority: "low" | "medium" | "high"
  customerNotes?: string
}

// Mock data per gli ordini in cucina
const initialKitchenOrders: KitchenOrder[] = [
  {
    id: "ORD-001",
    tableNumber: 5,
    items: [
      {
        id: "1",
        name: "Pizza Margherita",
        quantity: 2,
        category: "Pizza",
        preparationTime: 15,
        allergens: ["Glutine", "Lattosio"],
        notes: "Senza basilico",
      },
      {
        id: "2",
        name: "Spaghetti Carbonara",
        quantity: 1,
        category: "Primi",
        preparationTime: 12,
        allergens: ["Glutine", "Uova", "Lattosio"],
      },
    ],
    status: "preparing",
    waiter: "Marco",
    createdAt: new Date(Date.now() - 8 * 60000), // 8 minuti fa
    estimatedTime: 15,
    priority: "high",
    customerNotes: "Cliente allergico alle noci",
  },
  {
    id: "ORD-002",
    tableNumber: 12,
    items: [
      {
        id: "3",
        name: "Bistecca alla Griglia",
        quantity: 1,
        category: "Secondi",
        preparationTime: 25,
        allergens: [],
        notes: "Cottura media",
      },
      {
        id: "4",
        name: "Contorno di Verdure",
        quantity: 1,
        category: "Contorni",
        preparationTime: 10,
        allergens: [],
      },
    ],
    status: "preparing",
    waiter: "Sara",
    createdAt: new Date(Date.now() - 12 * 60000), // 12 minuti fa
    estimatedTime: 25,
    priority: "medium",
  },
  {
    id: "ORD-003",
    tableNumber: 8,
    items: [
      {
        id: "5",
        name: "Risotto ai Funghi",
        quantity: 1,
        category: "Primi",
        preparationTime: 20,
        allergens: ["Lattosio"],
      },
    ],
    status: "ready",
    waiter: "Luca",
    createdAt: new Date(Date.now() - 18 * 60000), // 18 minuti fa
    estimatedTime: 20,
    priority: "high",
  },
  {
    id: "ORD-004",
    tableNumber: 3,
    items: [
      {
        id: "6",
        name: "Pizza Diavola",
        quantity: 1,
        category: "Pizza",
        preparationTime: 15,
        allergens: ["Glutine", "Lattosio"],
      },
      {
        id: "7",
        name: "Antipasto della Casa",
        quantity: 1,
        category: "Antipasti",
        preparationTime: 5,
        allergens: ["Lattosio"],
      },
    ],
    status: "ready",
    waiter: "Anna",
    createdAt: new Date(Date.now() - 5 * 60000), // 5 minuti fa
    estimatedTime: 15,
    priority: "medium",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "preparing":
      return "bg-yellow-500"
    case "ready":
      return "bg-green-500"
    case "served":
      return "bg-blue-500"
    default:
      return "bg-gray-400"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500"
    case "medium":
      return "bg-orange-500"
    case "low":
      return "bg-green-500"
    default:
      return "bg-gray-400"
  }
}

const getElapsedTime = (createdAt: Date) => {
  const now = new Date()
  const elapsed = Math.floor((now.getTime() - createdAt.getTime()) / 60000)
  return elapsed
}

const isOverdue = (createdAt: Date, estimatedTime: number) => {
  const elapsed = getElapsedTime(createdAt)
  return elapsed > estimatedTime
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialKitchenOrders)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Aggiorna l'ora ogni 30 secondi
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: "preparing" | "ready" | "served") => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getKitchenStats = () => {
    const preparing = orders.filter((o) => o.status === "preparing").length
    const ready = orders.filter((o) => o.status === "ready").length
    const overdue = orders.filter((o) => o.status === "preparing" && isOverdue(o.createdAt, o.estimatedTime)).length
    const avgWaitTime =
      orders.length > 0
        ? Math.round(orders.reduce((sum, order) => sum + getElapsedTime(order.createdAt), 0) / orders.length)
        : 0

    return { preparing, ready, overdue, avgWaitTime }
  }

  const stats = getKitchenStats()

  // Ordina per priorità e tempo
  const sortedOrders = [...orders].sort((a, b) => {
    // Prima per stato (preparing prima di ready)
    if (a.status !== b.status) {
      if (a.status === "preparing") return -1
      if (b.status === "preparing") return 1
    }

    // Poi per priorità
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff

    // Infine per tempo (più vecchi prima)
    return a.createdAt.getTime() - b.createdAt.getTime()
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cucina</h1>
          <p className="text-muted-foreground">
            Gestione ordini in tempo reale - {currentTime.toLocaleTimeString("it-IT")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
            <div className="text-sm text-muted-foreground">Pronti</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-600">{stats.preparing}</div>
            <div className="text-sm text-muted-foreground">In Preparazione</div>
          </div>
          {stats.overdue > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-sm text-muted-foreground">In Ritardo</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Preparazione</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.preparing}</div>
            <p className="text-xs text-muted-foreground">Ordini attivi in cucina</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pronti</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ready}</div>
            <p className="text-xs text-muted-foreground">Da servire ai tavoli</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Ritardo</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Oltre il tempo stimato</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Medio</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWaitTime}min</div>
            <p className="text-xs text-muted-foreground">Attesa media ordini</p>
          </CardContent>
        </Card>
      </div>

      {/* Ordini Cucina */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ordini in Preparazione */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              In Preparazione ({stats.preparing})
            </CardTitle>
            <CardDescription>Ordini attualmente in cucina</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {sortedOrders
                  .filter((order) => order.status === "preparing")
                  .map((order) => {
                    const elapsed = getElapsedTime(order.createdAt)
                    const overdue = isOverdue(order.createdAt, order.estimatedTime)

                    return (
                      <div
                        key={order.id}
                        className={`border rounded-lg p-4 ${overdue ? "border-red-500 bg-red-50" : "border-border"}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">
                              {order.id}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Tavolo {order.tableNumber}</span>
                            </div>
                            <Badge className={`${getPriorityColor(order.priority)} text-white`}>
                              {order.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${overdue ? "text-red-600" : "text-foreground"}`}>
                              {elapsed}min
                            </div>
                            <div className="text-xs text-muted-foreground">Stima: {order.estimatedTime}min</div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {item.quantity}x {item.name}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    {item.category}
                                  </Badge>
                                </div>
                                {item.notes && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <StickyNote className="h-3 w-3 text-orange-500" />
                                    <span className="text-xs text-orange-600">{item.notes}</span>
                                  </div>
                                )}
                                {item.allergens.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {item.allergens.map((allergen) => (
                                      <Badge key={allergen} variant="destructive" className="text-xs">
                                        {allergen}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{item.preparationTime}min</div>
                            </div>
                          ))}
                        </div>

                        {order.customerNotes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                            <div className="flex items-center gap-1 text-yellow-800">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Note Cliente:</span>
                            </div>
                            <p className="text-sm text-yellow-700 mt-1">{order.customerNotes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{order.waiter}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>
                              {order.createdAt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <Button
                            onClick={() => updateOrderStatus(order.id, "ready")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Pronto
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Ordini Pronti */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Pronti per il Servizio ({stats.ready})
            </CardTitle>
            <CardDescription>Ordini completati da servire</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {sortedOrders
                  .filter((order) => order.status === "ready")
                  .map((order) => {
                    const elapsed = getElapsedTime(order.createdAt)

                    return (
                      <div key={order.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">
                              {order.id}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Tavolo {order.tableNumber}</span>
                            </div>
                            <Badge className="bg-green-500 text-white">PRONTO</Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{elapsed}min</div>
                            <div className="text-xs text-muted-foreground">Completato</div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                              <span className="font-medium">
                                {item.quantity}x {item.name}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {item.category}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{order.waiter}</span>
                          </div>
                          <Button
                            onClick={() => updateOrderStatus(order.id, "served")}
                            variant="outline"
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                          >
                            <Utensils className="mr-2 h-4 w-4" />
                            Servito
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

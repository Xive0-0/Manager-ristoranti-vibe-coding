"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Receipt, Plus, Clock, ChefHat, CheckCircle, DollarSign, MapPin, Minus, Trash2, Edit } from "lucide-react"

// Tipi per gli ordini
type OrderStatus = "preparing" | "ready" | "served" | "paid"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  notes?: string
}

interface Order {
  id: string
  tableNumber: number
  items: OrderItem[]
  status: OrderStatus
  waiter: string
  createdAt: string
  total: number
}

// Mock data per gli ordini
const initialOrders: Order[] = [
  {
    id: "ORD-001",
    tableNumber: 5,
    items: [
      { id: "1", name: "Pizza Margherita", price: 12.5, quantity: 1 },
      { id: "2", name: "Spaghetti Carbonara", price: 16.0, quantity: 1 },
    ],
    status: "preparing",
    waiter: "Marco",
    createdAt: "19:30",
    total: 28.5,
  },
  {
    id: "ORD-002",
    tableNumber: 12,
    items: [
      { id: "3", name: "Antipasto Misto", price: 18.0, quantity: 1 },
      { id: "4", name: "Bistecca alla Griglia", price: 27.0, quantity: 1 },
    ],
    status: "ready",
    waiter: "Sara",
    createdAt: "19:15",
    total: 45.0,
  },
  {
    id: "ORD-003",
    tableNumber: 8,
    items: [
      { id: "5", name: "Tiramisù", price: 8.0, quantity: 1 },
      { id: "6", name: "Caffè Espresso", price: 2.5, quantity: 2 },
    ],
    status: "served",
    waiter: "Luca",
    createdAt: "20:00",
    total: 13.0,
  },
]

// Menu items per il nuovo ordine
const menuItems = [
  { id: "1", name: "Pizza Margherita", price: 12.5, category: "Pizza" },
  { id: "2", name: "Pizza Diavola", price: 15.5, category: "Pizza" },
  { id: "3", name: "Spaghetti Carbonara", price: 16.0, category: "Primi" },
  { id: "4", name: "Risotto ai Funghi", price: 18.0, category: "Primi" },
  { id: "5", name: "Bistecca alla Griglia", price: 27.0, category: "Secondi" },
  { id: "6", name: "Salmone al Forno", price: 24.0, category: "Secondi" },
  { id: "7", name: "Antipasto Misto", price: 18.0, category: "Antipasti" },
  { id: "8", name: "Tiramisù", price: 8.0, category: "Dessert" },
  { id: "9", name: "Caffè Espresso", price: 2.5, category: "Bevande" },
]

const getStatusColor = (status: OrderStatus) => {
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

const getStatusText = (status: OrderStatus) => {
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

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "preparing":
      return <ChefHat className="h-4 w-4" />
    case "ready":
      return <CheckCircle className="h-4 w-4" />
    case "served":
      return <Receipt className="h-4 w-4" />
    case "paid":
      return <DollarSign className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [newOrderItems, setNewOrderItems] = useState<OrderItem[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false)
  const [editOrderItems, setEditOrderItems] = useState<OrderItem[]>([])

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const addItemToNewOrder = (menuItem: (typeof menuItems)[0]) => {
    const existingItem = newOrderItems.find((item) => item.id === menuItem.id)

    if (existingItem) {
      setNewOrderItems(
        newOrderItems.map((item) => (item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      setNewOrderItems([
        ...newOrderItems,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ])
    }
  }

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setNewOrderItems(newOrderItems.filter((item) => item.id !== itemId))
    } else {
      setNewOrderItems(newOrderItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const calculateNewOrderTotal = () => {
    return newOrderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const createNewOrder = () => {
    if (newOrderItems.length === 0 || !selectedTable) return

    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      tableNumber: Number.parseInt(selectedTable),
      items: newOrderItems,
      status: "preparing",
      waiter: "Mario", // In un'app reale, questo verrebbe dall'autenticazione
      createdAt: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
      total: calculateNewOrderTotal(),
    }

    setOrders([newOrder, ...orders])
    setNewOrderItems([])
    setSelectedTable("")
    setIsNewOrderOpen(false)
  }

  const openEditOrder = (order: Order) => {
    setEditingOrder(order)
    setEditOrderItems([...order.items])
    setIsEditOrderOpen(true)
  }

  const addItemToEditOrder = (menuItem: (typeof menuItems)[0]) => {
    const existingItem = editOrderItems.find((item) => item.id === menuItem.id)

    if (existingItem) {
      setEditOrderItems(
        editOrderItems.map((item) => (item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      setEditOrderItems([
        ...editOrderItems,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ])
    }
  }

  const updateEditItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setEditOrderItems(editOrderItems.filter((item) => item.id !== itemId))
    } else {
      setEditOrderItems(editOrderItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const calculateEditOrderTotal = () => {
    return editOrderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const saveEditOrder = () => {
    if (!editingOrder || editOrderItems.length === 0) return

    const updatedOrder: Order = {
      ...editingOrder,
      items: editOrderItems,
      total: calculateEditOrderTotal(),
    }

    setOrders(orders.map((order) => (order.id === editingOrder.id ? updatedOrder : order)))
    setEditingOrder(null)
    setEditOrderItems([])
    setIsEditOrderOpen(false)
  }

  const deleteOrder = (orderId: string) => {
    setOrders(orders.filter((order) => order.id !== orderId))
  }

  const getOrderStats = () => {
    const preparing = orders.filter((o) => o.status === "preparing").length
    const ready = orders.filter((o) => o.status === "ready").length
    const served = orders.filter((o) => o.status === "served").length
    const paid = orders.filter((o) => o.status === "paid").length

    return { preparing, ready, served, paid, total: orders.length }
  }

  const stats = getOrderStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestione Ordini</h1>
          <p className="text-muted-foreground">Monitora e gestisci tutti gli ordini in tempo reale</p>
        </div>
        <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuovo Ordine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crea Nuovo Ordine</DialogTitle>
              <DialogDescription>Seleziona il tavolo e aggiungi i piatti all'ordine</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Selezione Tavolo */}
              <div className="space-y-2">
                <Label>Tavolo</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un tavolo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Tavolo {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Menu Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Menu</h3>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.category}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">€{item.price.toFixed(2)}</span>
                        <Button size="sm" onClick={() => addItemToNewOrder(item)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ordine Corrente */}
              {newOrderItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ordine Corrente</h3>
                  <div className="space-y-2">
                    {newOrderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="font-medium">{item.name}</div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <span className="w-16 text-right">€{(item.price * item.quantity).toFixed(2)}</span>
                          <Button size="sm" variant="destructive" onClick={() => updateItemQuantity(item.id, 0)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Totale: €{calculateNewOrderTotal().toFixed(2)}</span>
                    <Button onClick={createNewOrder} disabled={!selectedTable}>
                      Crea Ordine
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog Modifica Ordine */}
        <Dialog open={isEditOrderOpen} onOpenChange={setIsEditOrderOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifica Ordine {editingOrder?.id}</DialogTitle>
              <DialogDescription>
                Modifica i piatti dell'ordine per il Tavolo {editingOrder?.tableNumber}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Menu Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Aggiungi Piatti</h3>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.category}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">€{item.price.toFixed(2)}</span>
                        <Button size="sm" onClick={() => addItemToEditOrder(item)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ordine Corrente */}
              {editOrderItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Piatti nell'Ordine</h3>
                  <div className="space-y-2">
                    {editOrderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="font-medium">{item.name}</div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateEditItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateEditItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <span className="w-16 text-right">€{(item.price * item.quantity).toFixed(2)}</span>
                          <Button size="sm" variant="destructive" onClick={() => updateEditItemQuantity(item.id, 0)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Nuovo Totale: €{calculateEditOrderTotal().toFixed(2)}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditOrderOpen(false)}>
                        Annulla
                      </Button>
                      <Button onClick={saveEditOrder} disabled={editOrderItems.length === 0}>
                        Salva Modifiche
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
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
            <p className="text-xs text-muted-foreground">Ordini in cucina</p>
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
            <CardTitle className="text-sm font-medium">Serviti</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.served}</div>
            <p className="text-xs text-muted-foreground">In attesa di pagamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completati</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">Ordini pagati oggi</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista Ordini */}
      <Card>
        <CardHeader>
          <CardTitle>Ordini Attivi</CardTitle>
          <CardDescription>Tutti gli ordini in corso di elaborazione</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      {order.id}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Tavolo {order.tableNumber}</span>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{getStatusText(order.status)}</span>
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">€{order.total.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.waiter} • {order.createdAt}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {order.status === "preparing" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Segna come Pronto
                    </Button>
                  )}
                  {order.status === "ready" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "served")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Segna come Servito
                    </Button>
                  )}
                  {order.status === "served" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "paid")}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      Segna come Pagato
                    </Button>
                  )}

                  {/* Nuovi bottoni per modifica ed eliminazione */}
                  {order.status !== "paid" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => openEditOrder(order)}>
                        <Edit className="mr-1 h-4 w-4" />
                        Modifica
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteOrder(order.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
                        Elimina
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

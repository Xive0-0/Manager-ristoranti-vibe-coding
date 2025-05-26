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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Clock, User, MapPin } from "lucide-react"

// Tipi per i tavoli
type TableStatus = "free" | "occupied" | "reserved" | "cleaning"

interface Table {
  id: number
  capacity: number
  status: TableStatus
  waiter?: string
  occupiedSince?: string
  reservedFor?: string
  currentOrder?: string
}

// Mock data per i tavoli
const initialTables: Table[] = [
  { id: 1, capacity: 2, status: "free" },
  { id: 2, capacity: 4, status: "occupied", waiter: "Marco", occupiedSince: "19:30", currentOrder: "ORD-001" },
  { id: 3, capacity: 6, status: "reserved", reservedFor: "20:30" },
  { id: 4, capacity: 2, status: "cleaning" },
  { id: 5, capacity: 4, status: "occupied", waiter: "Sara", occupiedSince: "19:15", currentOrder: "ORD-002" },
  { id: 6, capacity: 8, status: "free" },
  { id: 7, capacity: 2, status: "occupied", waiter: "Luca", occupiedSince: "20:00", currentOrder: "ORD-003" },
  { id: 8, capacity: 4, status: "free" },
  { id: 9, capacity: 6, status: "reserved", reservedFor: "21:00" },
  { id: 10, capacity: 2, status: "occupied", waiter: "Anna", occupiedSince: "19:45", currentOrder: "ORD-004" },
  { id: 11, capacity: 4, status: "cleaning" },
  { id: 12, capacity: 2, status: "free" },
]

const getStatusColor = (status: TableStatus) => {
  switch (status) {
    case "free":
      return "bg-green-500 hover:bg-green-600"
    case "occupied":
      return "bg-red-500 hover:bg-red-600"
    case "reserved":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "cleaning":
      return "bg-blue-500 hover:bg-blue-600"
    default:
      return "bg-gray-400"
  }
}

const getStatusText = (status: TableStatus) => {
  switch (status) {
    case "free":
      return "Libero"
    case "occupied":
      return "Occupato"
    case "reserved":
      return "Prenotato"
    case "cleaning":
      return "Pulizia"
    default:
      return "Sconosciuto"
  }
}

const getStatusIcon = (status: TableStatus) => {
  switch (status) {
    case "free":
      return "🟢"
    case "occupied":
      return "🔴"
    case "reserved":
      return "🟡"
    case "cleaning":
      return "🔵"
    default:
      return "⚪"
  }
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

  const updateTableStatus = (tableId: number, newStatus: TableStatus) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              status: newStatus,
              ...(newStatus === "free" ? { waiter: undefined, occupiedSince: undefined, currentOrder: undefined } : {}),
            }
          : table,
      ),
    )
  }

  const getTableStats = () => {
    const free = tables.filter((t) => t.status === "free").length
    const occupied = tables.filter((t) => t.status === "occupied").length
    const reserved = tables.filter((t) => t.status === "reserved").length
    const cleaning = tables.filter((t) => t.status === "cleaning").length

    return { free, occupied, reserved, cleaning, total: tables.length }
  }

  const stats = getTableStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestione Tavoli</h1>
        <p className="text-muted-foreground">Mappa interattiva e gestione stati tavoli in tempo reale</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tavoli Liberi</CardTitle>
            <div className="text-2xl">🟢</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.free}</div>
            <p className="text-xs text-muted-foreground">Disponibili per nuovi clienti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tavoli Occupati</CardTitle>
            <div className="text-2xl">🔴</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupied}</div>
            <p className="text-xs text-muted-foreground">Clienti attualmente serviti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prenotazioni</CardTitle>
            <div className="text-2xl">🟡</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reserved}</div>
            <p className="text-xs text-muted-foreground">Tavoli prenotati per stasera</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Pulizia</CardTitle>
            <div className="text-2xl">🔵</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cleaning}</div>
            <p className="text-xs text-muted-foreground">Tavoli in preparazione</p>
          </CardContent>
        </Card>
      </div>

      {/* Mappa Tavoli */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mappa Tavoli Interattiva
          </CardTitle>
          <CardDescription>Clicca su un tavolo per visualizzare i dettagli e cambiare stato</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            {tables.map((table) => (
              <Dialog key={table.id}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={`h-24 w-full flex flex-col items-center justify-center gap-2 ${getStatusColor(table.status)} text-white border-2 transition-all hover:scale-105`}
                    onClick={() => setSelectedTable(table)}
                  >
                    <div className="text-lg font-bold">
                      {getStatusIcon(table.status)} {table.id}
                    </div>
                    <div className="text-xs opacity-90">
                      <Users className="inline h-3 w-3 mr-1" />
                      {table.capacity} posti
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tavolo {table.id}</DialogTitle>
                    <DialogDescription>Gestisci lo stato e le informazioni del tavolo</DialogDescription>
                  </DialogHeader>

                  {selectedTable && (
                    <div className="space-y-4">
                      <div className="grid gap-4 grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Capacità</label>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{selectedTable.capacity} persone</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Stato Attuale</label>
                          <Badge className={getStatusColor(selectedTable.status)}>
                            {getStatusText(selectedTable.status)}
                          </Badge>
                        </div>
                      </div>

                      {selectedTable.status === "occupied" && (
                        <div className="grid gap-4 grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Cameriere</label>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{selectedTable.waiter}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Occupato dalle</label>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{selectedTable.occupiedSince}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedTable.status === "reserved" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Prenotato per le</label>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{selectedTable.reservedFor}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cambia Stato</label>
                        <Select
                          value={selectedTable.status}
                          onValueChange={(value: TableStatus) => updateTableStatus(selectedTable.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">🟢 Libero</SelectItem>
                            <SelectItem value="occupied">🔴 Occupato</SelectItem>
                            <SelectItem value="reserved">🟡 Prenotato</SelectItem>
                            <SelectItem value="cleaning">🔵 In Pulizia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle>Legenda Stati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Libero - Disponibile per nuovi clienti</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Occupato - Clienti al tavolo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Prenotato - Riservato per un orario</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Pulizia - In preparazione</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

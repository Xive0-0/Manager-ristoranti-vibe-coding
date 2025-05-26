"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, Users, Phone, Edit, Trash2, Plus, MapPin, StickyNote } from "lucide-react"

// Tipi per le prenotazioni
interface Reservation {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  date: string
  time: string
  guests: number
  tableNumber?: number
  status: "confirmed" | "seated" | "completed" | "cancelled"
  notes?: string
  createdAt: Date
  specialRequests?: string
}

// Mock data per le prenotazioni
const initialReservations: Reservation[] = [
  {
    id: "RES-001",
    customerName: "Mario Rossi",
    customerPhone: "+39 333 1234567",
    customerEmail: "mario.rossi@email.com",
    date: "2024-01-15",
    time: "20:00",
    guests: 4,
    tableNumber: 8,
    status: "confirmed",
    notes: "Anniversario di matrimonio",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    specialRequests: "Tavolo vicino alla finestra",
  },
  {
    id: "RES-002",
    customerName: "Anna Bianchi",
    customerPhone: "+39 347 9876543",
    date: "2024-01-15",
    time: "19:30",
    guests: 2,
    tableNumber: 5,
    status: "seated",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "RES-003",
    customerName: "Giuseppe Verdi",
    customerPhone: "+39 320 5555555",
    date: "2024-01-15",
    time: "21:00",
    guests: 6,
    status: "confirmed",
    notes: "Cena di lavoro",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    specialRequests: "Menu vegetariano per 2 persone",
  },
  {
    id: "RES-004",
    customerName: "Laura Ferrari",
    customerPhone: "+39 366 7777777",
    customerEmail: "laura.ferrari@email.com",
    date: "2024-01-16",
    time: "20:30",
    guests: 3,
    status: "confirmed",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "RES-005",
    customerName: "Francesco Neri",
    customerPhone: "+39 339 8888888",
    date: "2024-01-14",
    time: "19:00",
    guests: 2,
    tableNumber: 12,
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
]

// Tavoli disponibili (mock)
const availableTables = [
  { number: 1, capacity: 2 },
  { number: 2, capacity: 4 },
  { number: 3, capacity: 2 },
  { number: 4, capacity: 4 },
  { number: 5, capacity: 4 },
  { number: 6, capacity: 8 },
  { number: 7, capacity: 2 },
  { number: 8, capacity: 6 },
  { number: 9, capacity: 6 },
  { number: 10, capacity: 2 },
  { number: 11, capacity: 4 },
  { number: 12, capacity: 2 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-500"
    case "seated":
      return "bg-green-500"
    case "completed":
      return "bg-gray-500"
    case "cancelled":
      return "bg-red-500"
    default:
      return "bg-gray-400"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Confermata"
    case "seated":
      return "Al Tavolo"
    case "completed":
      return "Completata"
    case "cancelled":
      return "Cancellata"
    default:
      return "Sconosciuto"
  }
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    guests: "",
    tableNumber: "",
    notes: "",
    specialRequests: "",
  })

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      date: new Date().toISOString().split("T")[0],
      time: "",
      guests: "",
      tableNumber: "",
      notes: "",
      specialRequests: "",
    })
    setEditingReservation(null)
  }

  const openEditDialog = (reservation: Reservation) => {
    setEditingReservation(reservation)
    setFormData({
      customerName: reservation.customerName,
      customerPhone: reservation.customerPhone,
      customerEmail: reservation.customerEmail || "",
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests.toString(),
      tableNumber: reservation.tableNumber?.toString() || "",
      notes: reservation.notes || "",
      specialRequests: reservation.specialRequests || "",
    })
  }

  const saveReservation = () => {
    if (!formData.customerName || !formData.customerPhone || !formData.date || !formData.time || !formData.guests) {
      return
    }

    const newReservation: Reservation = {
      id: editingReservation?.id || `RES-${String(reservations.length + 1).padStart(3, "0")}`,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || undefined,
      date: formData.date,
      time: formData.time,
      guests: Number.parseInt(formData.guests),
      tableNumber: formData.tableNumber ? Number.parseInt(formData.tableNumber) : undefined,
      status: editingReservation?.status || "confirmed",
      notes: formData.notes || undefined,
      specialRequests: formData.specialRequests || undefined,
      createdAt: editingReservation?.createdAt || new Date(),
    }

    if (editingReservation) {
      setReservations(reservations.map((res) => (res.id === editingReservation.id ? newReservation : res)))
    } else {
      setReservations([newReservation, ...reservations])
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const updateReservationStatus = (reservationId: string, newStatus: Reservation["status"]) => {
    setReservations(reservations.map((res) => (res.id === reservationId ? { ...res, status: newStatus } : res)))
  }

  const deleteReservation = (reservationId: string) => {
    setReservations(reservations.filter((res) => res.id !== reservationId))
  }

  const assignTable = (reservationId: string, tableNumber: number) => {
    setReservations(
      reservations.map((res) => (res.id === reservationId ? { ...res, tableNumber, status: "seated" } : res)),
    )
  }

  const getReservationStats = () => {
    const today = new Date().toISOString().split("T")[0]
    const todayReservations = reservations.filter((res) => res.date === today)

    const confirmed = todayReservations.filter((res) => res.status === "confirmed").length
    const seated = todayReservations.filter((res) => res.status === "seated").length
    const completed = todayReservations.filter((res) => res.status === "completed").length
    const totalGuests = todayReservations.reduce((sum, res) => sum + res.guests, 0)

    return { confirmed, seated, completed, totalGuests, total: todayReservations.length }
  }

  const stats = getReservationStats()

  // Filtra prenotazioni per data selezionata
  const filteredReservations = reservations.filter((res) => res.date === selectedDate)

  // Trova tavoli disponibili per una prenotazione
  const getAvailableTablesForReservation = (
    guests: number,
    date: string,
    time: string,
    excludeReservationId?: string,
  ) => {
    const reservationsAtTime = reservations.filter(
      (res) => res.date === date && res.time === time && res.status !== "cancelled" && res.id !== excludeReservationId,
    )

    const occupiedTables = reservationsAtTime.map((res) => res.tableNumber).filter(Boolean)

    return availableTables.filter((table) => table.capacity >= guests && !occupiedTables.includes(table.number))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prenotazioni</h1>
          <p className="text-muted-foreground">Gestisci le prenotazioni e assegna i tavoli</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nuova Prenotazione
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingReservation ? "Modifica Prenotazione" : "Nuova Prenotazione"}</DialogTitle>
              <DialogDescription>Inserisci i dettagli della prenotazione</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nome Cliente *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Mario Rossi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Telefono *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+39 333 1234567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="mario.rossi@email.com"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Orario *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Persone *</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    placeholder="4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tableNumber">Tavolo (opzionale)</Label>
                <Select
                  value={formData.tableNumber}
                  onValueChange={(value) => setFormData({ ...formData, tableNumber: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tavolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nessun tavolo assegnato</SelectItem>
                    {formData.guests &&
                      formData.date &&
                      formData.time &&
                      getAvailableTablesForReservation(
                        Number.parseInt(formData.guests),
                        formData.date,
                        formData.time,
                        editingReservation?.id,
                      ).map((table) => (
                        <SelectItem key={table.number} value={table.number.toString()}>
                          Tavolo {table.number} ({table.capacity} posti)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Note</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Anniversario, compleanno, ecc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Richieste Speciali</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Allergie, preferenze alimentari, posizione tavolo, ecc."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={saveReservation}>
                  {editingReservation ? "Salva Modifiche" : "Crea Prenotazione"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confermate Oggi</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Prenotazioni confermate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Al Tavolo</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.seated}</div>
            <p className="text-xs text-muted-foreground">Clienti attualmente serviti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Servizi completati oggi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ospiti Totali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
            <p className="text-xs text-muted-foreground">Persone previste oggi</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtro Data */}
      <Card>
        <CardHeader>
          <CardTitle>Filtro per Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="dateFilter">Visualizza prenotazioni per:</Label>
            <Input
              id="dateFilter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            <div className="text-sm text-muted-foreground">{filteredReservations.length} prenotazioni trovate</div>
          </div>
        </CardContent>
      </Card>

      {/* Lista Prenotazioni */}
      <Card>
        <CardHeader>
          <CardTitle>
            Prenotazioni del{" "}
            {new Date(selectedDate).toLocaleDateString("it-IT", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardTitle>
          <CardDescription>Gestisci le prenotazioni e assegna i tavoli</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReservations
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((reservation) => (
                <div key={reservation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        {reservation.id}
                      </Badge>
                      <div className="font-semibold text-lg">{reservation.customerName}</div>
                      <Badge className={`${getStatusColor(reservation.status)} text-white`}>
                        {getStatusText(reservation.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          openEditDialog(reservation)
                          setIsAddDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancella Prenotazione</AlertDialogTitle>
                            <AlertDialogDescription>
                              Sei sicuro di voler cancellare la prenotazione di {reservation.customerName}? Questa
                              azione non può essere annullata.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annulla</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteReservation(reservation.id)}>
                              Cancella
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.customerPhone}</span>
                      </div>
                      {reservation.customerEmail && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="text-sm">{reservation.customerEmail}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.guests} persone</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {reservation.tableNumber ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Tavolo {reservation.tableNumber}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">Nessun tavolo assegnato</div>
                      )}

                      {reservation.notes && (
                        <div className="flex items-start gap-2">
                          <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-sm">{reservation.notes}</span>
                        </div>
                      )}

                      {reservation.specialRequests && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                          <div className="text-sm font-medium text-yellow-800">Richieste Speciali:</div>
                          <div className="text-sm text-yellow-700">{reservation.specialRequests}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Azioni */}
                  <div className="flex items-center gap-2 mt-4">
                    {reservation.status === "confirmed" && !reservation.tableNumber && (
                      <Select onValueChange={(value) => assignTable(reservation.id, Number.parseInt(value))}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Assegna tavolo" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableTablesForReservation(
                            reservation.guests,
                            reservation.date,
                            reservation.time,
                            reservation.id,
                          ).map((table) => (
                            <SelectItem key={table.number} value={table.number.toString()}>
                              Tavolo {table.number} ({table.capacity} posti)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {reservation.status === "confirmed" && reservation.tableNumber && (
                      <Button
                        size="sm"
                        onClick={() => updateReservationStatus(reservation.id, "seated")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Segna come Al Tavolo
                      </Button>
                    )}

                    {reservation.status === "seated" && (
                      <Button
                        size="sm"
                        onClick={() => updateReservationStatus(reservation.id, "completed")}
                        variant="outline"
                      >
                        Completa Servizio
                      </Button>
                    )}

                    {reservation.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                      >
                        Cancella
                      </Button>
                    )}
                  </div>
                </div>
              ))}

            {filteredReservations.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nessuna prenotazione</h3>
                <p className="text-muted-foreground">Non ci sono prenotazioni per la data selezionata.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

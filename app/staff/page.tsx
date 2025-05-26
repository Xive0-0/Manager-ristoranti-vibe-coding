"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Plus, Edit, Trash2, Star, Calendar, Phone, Mail, Target, Activity } from "lucide-react"

// Tipi per lo staff
interface StaffMember {
  id: string
  name: string
  role: "waiter" | "kitchen" | "manager" | "admin"
  email: string
  phone: string
  status: "active" | "inactive" | "on_break"
  hireDate: string
  salary: number
  performance: {
    ordersServed: number
    avgServiceTime: number
    customerRating: number
    efficiency: number
  }
  schedule: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  totalHours: number
  overtimeHours: number
}

// Mock data per lo staff
const initialStaff: StaffMember[] = [
  {
    id: "1",
    name: "Marco Bianchi",
    role: "waiter",
    email: "marco@ristorante.com",
    phone: "+39 333 1111111",
    status: "active",
    hireDate: "2023-01-15",
    salary: 1800,
    performance: {
      ordersServed: 156,
      avgServiceTime: 16.2,
      customerRating: 4.8,
      efficiency: 94.5,
    },
    schedule: {
      monday: "18:00-24:00",
      tuesday: "18:00-24:00",
      wednesday: "Riposo",
      thursday: "18:00-24:00",
      friday: "18:00-01:00",
      saturday: "18:00-01:00",
      sunday: "Riposo",
    },
    totalHours: 168,
    overtimeHours: 8,
  },
  {
    id: "2",
    name: "Sara Verdi",
    role: "waiter",
    email: "sara@ristorante.com",
    phone: "+39 333 2222222",
    status: "active",
    hireDate: "2023-03-20",
    salary: 1750,
    performance: {
      ordersServed: 142,
      avgServiceTime: 17.1,
      customerRating: 4.7,
      efficiency: 91.2,
    },
    schedule: {
      monday: "18:00-24:00",
      tuesday: "Riposo",
      wednesday: "18:00-24:00",
      thursday: "18:00-24:00",
      friday: "18:00-01:00",
      saturday: "18:00-01:00",
      sunday: "18:00-24:00",
    },
    totalHours: 162,
    overtimeHours: 2,
  },
  {
    id: "3",
    name: "Giuseppe Neri",
    role: "kitchen",
    email: "giuseppe@ristorante.com",
    phone: "+39 333 3333333",
    status: "active",
    hireDate: "2022-06-10",
    salary: 2200,
    performance: {
      ordersServed: 89,
      avgServiceTime: 18.5,
      customerRating: 4.6,
      efficiency: 96.8,
    },
    schedule: {
      monday: "17:00-24:00",
      tuesday: "17:00-24:00",
      wednesday: "17:00-24:00",
      thursday: "Riposo",
      friday: "17:00-01:00",
      saturday: "17:00-01:00",
      sunday: "Riposo",
    },
    totalHours: 175,
    overtimeHours: 15,
  },
  {
    id: "4",
    name: "Anna Ferrari",
    role: "waiter",
    email: "anna@ristorante.com",
    phone: "+39 333 4444444",
    status: "on_break",
    hireDate: "2023-08-05",
    salary: 1700,
    performance: {
      ordersServed: 98,
      avgServiceTime: 19.3,
      customerRating: 4.5,
      efficiency: 87.3,
    },
    schedule: {
      monday: "Riposo",
      tuesday: "18:00-24:00",
      wednesday: "18:00-24:00",
      thursday: "18:00-24:00",
      friday: "Riposo",
      saturday: "18:00-01:00",
      sunday: "18:00-24:00",
    },
    totalHours: 145,
    overtimeHours: 0,
  },
]

const getRoleColor = (role: string) => {
  switch (role) {
    case "waiter":
      return "bg-blue-500"
    case "kitchen":
      return "bg-orange-500"
    case "manager":
      return "bg-purple-500"
    case "admin":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const getRoleText = (role: string) => {
  switch (role) {
    case "waiter":
      return "Cameriere"
    case "kitchen":
      return "Cucina"
    case "manager":
      return "Manager"
    case "admin":
      return "Admin"
    default:
      return "Sconosciuto"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "inactive":
      return "bg-gray-500"
    case "on_break":
      return "bg-yellow-500"
    default:
      return "bg-gray-400"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Attivo"
    case "inactive":
      return "Inattivo"
    case "on_break":
      return "In Pausa"
    default:
      return "Sconosciuto"
  }
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>("all")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "waiter" as StaffMember["role"],
    email: "",
    phone: "",
    salary: "",
    hireDate: new Date().toISOString().split("T")[0],
  })

  const resetForm = () => {
    setFormData({
      name: "",
      role: "waiter",
      email: "",
      phone: "",
      salary: "",
      hireDate: new Date().toISOString().split("T")[0],
    })
    setEditingMember(null)
  }

  const openEditDialog = (member: StaffMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      salary: member.salary.toString(),
      hireDate: member.hireDate,
    })
  }

  const saveMember = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.salary) return

    const newMember: StaffMember = {
      id: editingMember?.id || Date.now().toString(),
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      status: editingMember?.status || "active",
      hireDate: formData.hireDate,
      salary: Number.parseFloat(formData.salary),
      performance: editingMember?.performance || {
        ordersServed: 0,
        avgServiceTime: 0,
        customerRating: 0,
        efficiency: 0,
      },
      schedule: editingMember?.schedule || {
        monday: "Riposo",
        tuesday: "Riposo",
        wednesday: "Riposo",
        thursday: "Riposo",
        friday: "Riposo",
        saturday: "Riposo",
        sunday: "Riposo",
      },
      totalHours: editingMember?.totalHours || 0,
      overtimeHours: editingMember?.overtimeHours || 0,
    }

    if (editingMember) {
      setStaff(staff.map((member) => (member.id === editingMember.id ? newMember : member)))
    } else {
      setStaff([...staff, newMember])
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const deleteMember = (memberId: string) => {
    setStaff(staff.filter((member) => member.id !== memberId))
  }

  const updateMemberStatus = (memberId: string, newStatus: StaffMember["status"]) => {
    setStaff(staff.map((member) => (member.id === memberId ? { ...member, status: newStatus } : member)))
  }

  const getStaffStats = () => {
    const total = staff.length
    const active = staff.filter((m) => m.status === "active").length
    const avgRating = staff.reduce((sum, m) => sum + m.performance.customerRating, 0) / total
    const totalSalary = staff.reduce((sum, m) => sum + m.salary, 0)

    return { total, active, avgRating, totalSalary }
  }

  const filteredStaff = selectedRole === "all" ? staff : staff.filter((member) => member.role === selectedRole)

  const stats = getStaffStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestione Staff</h1>
          <p className="text-muted-foreground">Monitora performance e gestisci il personale del ristorante</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi Dipendente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMember ? "Modifica Dipendente" : "Nuovo Dipendente"}</DialogTitle>
              <DialogDescription>Inserisci i dettagli del membro dello staff</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Mario Rossi"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Ruolo *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: StaffMember["role"]) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waiter">Cameriere</SelectItem>
                      <SelectItem value="kitchen">Cucina</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Stipendio (€) *</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="1800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="mario@ristorante.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+39 333 1234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hireDate">Data Assunzione *</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={saveMember}>{editingMember ? "Salva Modifiche" : "Aggiungi Dipendente"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Totale</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Dipendenti registrati</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attivi Oggi</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">In servizio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Medio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Valutazione staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Totale</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Stipendi mensili</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtri */}
      <Card>
        <CardHeader>
          <CardTitle>Filtri Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label>Filtra per ruolo:</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i Ruoli</SelectItem>
                <SelectItem value="waiter">Camerieri</SelectItem>
                <SelectItem value="kitchen">Cucina</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista Staff */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-lg">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getRoleColor(member.role)} text-white`}>{getRoleText(member.role)}</Badge>
                      <Badge className={`${getStatusColor(member.status)} text-white`}>
                        {getStatusText(member.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      openEditDialog(member)
                      setIsAddDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteMember(member.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Dal {new Date(member.hireDate).toLocaleDateString("it-IT")}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold">{member.performance.ordersServed}</div>
                    <div className="text-xs text-muted-foreground">Ordini</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {member.performance.customerRating}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{member.performance.avgServiceTime}min</div>
                    <div className="text-xs text-muted-foreground">Tempo Medio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">€{member.salary}</div>
                    <div className="text-xs text-muted-foreground">Stipendio</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  {member.status === "active" && (
                    <Button size="sm" variant="outline" onClick={() => updateMemberStatus(member.id, "on_break")}>
                      Metti in Pausa
                    </Button>
                  )}
                  {member.status === "on_break" && (
                    <Button size="sm" onClick={() => updateMemberStatus(member.id, "active")}>
                      Riattiva
                    </Button>
                  )}
                  {member.status === "inactive" && (
                    <Button size="sm" onClick={() => updateMemberStatus(member.id, "active")}>
                      Riattiva
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nessun dipendente trovato</h3>
            <p className="text-muted-foreground">Prova a modificare i filtri o aggiungi un nuovo membro dello staff.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

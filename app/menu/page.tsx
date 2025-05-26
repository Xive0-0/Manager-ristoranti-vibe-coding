"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, ChefHat, DollarSign, Clock, Star } from "lucide-react"

// Tipi per il menu
interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  preparationTime: number
  allergens: string[]
  rating: number
  image?: string
}

// Mock data per il menu
const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    description: "Pomodoro, mozzarella, basilico fresco",
    price: 12.5,
    category: "Pizza",
    available: true,
    preparationTime: 15,
    allergens: ["Glutine", "Lattosio"],
    rating: 4.8,
  },
  {
    id: "2",
    name: "Pizza Diavola",
    description: "Pomodoro, mozzarella, salame piccante",
    price: 15.5,
    category: "Pizza",
    available: true,
    preparationTime: 15,
    allergens: ["Glutine", "Lattosio"],
    rating: 4.6,
  },
  {
    id: "3",
    name: "Spaghetti Carbonara",
    description: "Pasta, uova, guanciale, pecorino romano",
    price: 16.0,
    category: "Primi",
    available: true,
    preparationTime: 12,
    allergens: ["Glutine", "Uova", "Lattosio"],
    rating: 4.9,
  },
  {
    id: "4",
    name: "Risotto ai Funghi Porcini",
    description: "Riso Carnaroli, funghi porcini, parmigiano",
    price: 18.0,
    category: "Primi",
    available: false,
    preparationTime: 20,
    allergens: ["Lattosio"],
    rating: 4.7,
  },
  {
    id: "5",
    name: "Bistecca alla Griglia",
    description: "Manzo argentino, rosmarino, patate arrosto",
    price: 27.0,
    category: "Secondi",
    available: true,
    preparationTime: 25,
    allergens: [],
    rating: 4.5,
  },
  {
    id: "6",
    name: "Salmone al Forno",
    description: "Filetto di salmone, verdure di stagione",
    price: 24.0,
    category: "Secondi",
    available: true,
    preparationTime: 18,
    allergens: ["Pesce"],
    rating: 4.4,
  },
  {
    id: "7",
    name: "Antipasto della Casa",
    description: "Selezione di salumi e formaggi locali",
    price: 18.0,
    category: "Antipasti",
    available: true,
    preparationTime: 5,
    allergens: ["Lattosio"],
    rating: 4.3,
  },
  {
    id: "8",
    name: "Tiramisù",
    description: "Dolce tradizionale con mascarpone e caffè",
    price: 8.0,
    category: "Dessert",
    available: true,
    preparationTime: 2,
    allergens: ["Glutine", "Uova", "Lattosio"],
    rating: 4.8,
  },
  {
    id: "9",
    name: "Caffè Espresso",
    description: "Miscela arabica italiana",
    price: 2.5,
    category: "Bevande",
    available: true,
    preparationTime: 1,
    allergens: [],
    rating: 4.2,
  },
]

const categories = ["Tutti", "Antipasti", "Primi", "Secondi", "Pizza", "Dessert", "Bevande"]

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tutti")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  // Form state per nuovo/modifica item
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
    preparationTime: "",
    allergens: "",
  })

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Tutti" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleAvailability = (itemId: string) => {
    setMenuItems(menuItems.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item)))
  }

  const deleteItem = (itemId: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      available: true,
      preparationTime: "",
      allergens: "",
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      available: item.available,
      preparationTime: item.preparationTime.toString(),
      allergens: item.allergens.join(", "),
    })
  }

  const saveItem = () => {
    if (!formData.name || !formData.price || !formData.category) return

    const newItem: MenuItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      available: formData.available,
      preparationTime: Number.parseInt(formData.preparationTime) || 10,
      allergens: formData.allergens
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a),
      rating: editingItem?.rating || 0,
    }

    if (editingItem) {
      setMenuItems(menuItems.map((item) => (item.id === editingItem.id ? newItem : item)))
    } else {
      setMenuItems([...menuItems, newItem])
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const getMenuStats = () => {
    const total = menuItems.length
    const available = menuItems.filter((item) => item.available).length
    const avgPrice = menuItems.reduce((sum, item) => sum + item.price, 0) / total
    const avgRating = menuItems.reduce((sum, item) => sum + item.rating, 0) / total

    return { total, available, avgPrice, avgRating }
  }

  const stats = getMenuStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Digitale</h1>
          <p className="text-muted-foreground">Gestisci il menu del ristorante, prezzi e disponibilità</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi Piatto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Modifica Piatto" : "Aggiungi Nuovo Piatto"}</DialogTitle>
              <DialogDescription>Inserisci i dettagli del piatto nel menu</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Piatto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Es. Pizza Margherita"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrivi gli ingredienti e la preparazione"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prezzo (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.50"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="12.50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((cat) => cat !== "Tutti")
                        .map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Tempo Preparazione (min)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    placeholder="15"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                  <Label htmlFor="available">Disponibile</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergens">Allergeni (separati da virgola)</Label>
                <Input
                  id="allergens"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                  placeholder="Glutine, Lattosio, Uova"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={saveItem}>{editingItem ? "Salva Modifiche" : "Aggiungi Piatto"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Piatti Totali</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Nel menu completo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibili</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
            <p className="text-xs text-muted-foreground">Piatti ordinabili oggi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prezzo Medio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.avgPrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Media prezzi menu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Medio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Valutazione clienti</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtri e Ricerca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtri Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca piatti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista Menu */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className={`${!item.available ? "opacity-60" : ""}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">€{item.price.toFixed(2)}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {item.preparationTime} min
                  </div>
                </div>

                {item.allergens.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.allergens.map((allergen) => (
                      <Badge key={allergen} variant="outline" className="text-xs">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={item.available} onCheckedChange={() => toggleAvailability(item.id)} />
                    <span className="text-sm">{item.available ? "Disponibile" : "Non disponibile"}</span>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        openEditDialog(item)
                        setIsAddDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nessun piatto trovato</h3>
            <p className="text-muted-foreground">
              Prova a modificare i filtri di ricerca o aggiungi un nuovo piatto al menu.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

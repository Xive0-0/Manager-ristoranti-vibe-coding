"use server"

import { revalidatePath } from "next/cache"
import type { Order, Reservation, Table, MenuItem, DashboardStats } from "./database"

// Simulazione database - in produzione usare un vero database
const mockOrders: Order[] = []
let mockReservations: Reservation[] = []
const mockTables: Table[] = []
let mockMenuItems: MenuItem[] = []

// Actions per Dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  // Simula query al database
  const today = new Date().toISOString().split("T")[0]

  const totalTables = 12
  const occupiedTables = mockTables.filter((t) => t.status === "occupied").length || 8
  const dailyRevenue =
    mockOrders
      .filter((o) => o.createdAt.toISOString().split("T")[0] === today && o.status === "paid")
      .reduce((sum, o) => sum + o.total, 0) || 2847.5

  const activeOrders = mockOrders.filter((o) => ["preparing", "ready"].includes(o.status)).length || 12

  const avgServiceTime = 28 // minuti
  const todayReservations = mockReservations.filter((r) => r.reservationDate === today).length || 34

  return {
    totalTables,
    occupiedTables,
    dailyRevenue,
    activeOrders,
    avgServiceTime,
    todayReservations,
  }
}

// Actions per Ordini
export async function createOrder(formData: FormData) {
  const tableId = Number.parseInt(formData.get("tableId") as string)
  const items = JSON.parse(formData.get("items") as string)

  const newOrder: Order = {
    id: Date.now(),
    orderNumber: `ORD-${String(mockOrders.length + 1).padStart(3, "0")}`,
    tableId,
    waiterId: 1, // In produzione, prendere dall'autenticazione
    status: "preparing",
    subtotal: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
    tax: 0,
    total: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
    priority: "medium",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockOrders.push(newOrder)
  revalidatePath("/ordini")
  revalidatePath("/")

  return { success: true, orderId: newOrder.id }
}

export async function updateOrderStatus(orderId: number, status: Order["status"]) {
  const orderIndex = mockOrders.findIndex((o) => o.id === orderId)
  if (orderIndex !== -1) {
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status,
      updatedAt: new Date(),
      ...(status === "paid" ? { completedAt: new Date() } : {}),
    }
  }

  revalidatePath("/ordini")
  revalidatePath("/cucina")
  revalidatePath("/")

  return { success: true }
}

export async function getOrders() {
  return mockOrders
}

// Actions per Prenotazioni
export async function createReservation(formData: FormData) {
  const newReservation: Reservation = {
    id: Date.now(),
    customerName: formData.get("customerName") as string,
    customerPhone: formData.get("customerPhone") as string,
    customerEmail: (formData.get("customerEmail") as string) || undefined,
    reservationDate: formData.get("date") as string,
    reservationTime: formData.get("time") as string,
    guests: Number.parseInt(formData.get("guests") as string),
    tableId: formData.get("tableId") ? Number.parseInt(formData.get("tableId") as string) : undefined,
    status: "confirmed",
    notes: (formData.get("notes") as string) || undefined,
    specialRequests: (formData.get("specialRequests") as string) || undefined,
    createdBy: 1, // In produzione, prendere dall'autenticazione
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockReservations.push(newReservation)
  revalidatePath("/prenotazioni")
  revalidatePath("/")

  return { success: true, reservationId: newReservation.id }
}

export async function updateReservation(id: number, formData: FormData) {
  const reservationIndex = mockReservations.findIndex((r) => r.id === id)
  if (reservationIndex !== -1) {
    mockReservations[reservationIndex] = {
      ...mockReservations[reservationIndex],
      customerName: formData.get("customerName") as string,
      customerPhone: formData.get("customerPhone") as string,
      customerEmail: (formData.get("customerEmail") as string) || undefined,
      reservationDate: formData.get("date") as string,
      reservationTime: formData.get("time") as string,
      guests: Number.parseInt(formData.get("guests") as string),
      tableId: formData.get("tableId") ? Number.parseInt(formData.get("tableId") as string) : undefined,
      notes: (formData.get("notes") as string) || undefined,
      specialRequests: (formData.get("specialRequests") as string) || undefined,
      updatedAt: new Date(),
    }
  }

  revalidatePath("/prenotazioni")
  return { success: true }
}

export async function updateReservationStatus(id: number, status: Reservation["status"]) {
  const reservationIndex = mockReservations.findIndex((r) => r.id === id)
  if (reservationIndex !== -1) {
    mockReservations[reservationIndex] = {
      ...mockReservations[reservationIndex],
      status,
      updatedAt: new Date(),
    }
  }

  revalidatePath("/prenotazioni")
  revalidatePath("/tavoli")
  revalidatePath("/")

  return { success: true }
}

export async function deleteReservation(id: number) {
  mockReservations = mockReservations.filter((r) => r.id !== id)
  revalidatePath("/prenotazioni")
  return { success: true }
}

export async function getReservations() {
  return mockReservations
}

// Actions per Tavoli
export async function updateTableStatus(tableId: number, status: Table["status"]) {
  const tableIndex = mockTables.findIndex((t) => t.id === tableId)
  if (tableIndex !== -1) {
    mockTables[tableIndex] = {
      ...mockTables[tableIndex],
      status,
      updatedAt: new Date(),
    }
  }

  revalidatePath("/tavoli")
  revalidatePath("/")

  return { success: true }
}

export async function getTables() {
  return mockTables
}

// Actions per Menu
export async function createMenuItem(formData: FormData) {
  const newMenuItem: MenuItem = {
    id: Date.now(),
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: Number.parseFloat(formData.get("price") as string),
    categoryId: Number.parseInt(formData.get("categoryId") as string),
    preparationTime: Number.parseInt(formData.get("preparationTime") as string) || 15,
    available: formData.get("available") === "true",
    allergens: (formData.get("allergens") as string)
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a),
    rating: 0,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockMenuItems.push(newMenuItem)
  revalidatePath("/menu")

  return { success: true, itemId: newMenuItem.id }
}

export async function updateMenuItem(id: number, formData: FormData) {
  const itemIndex = mockMenuItems.findIndex((item) => item.id === id)
  if (itemIndex !== -1) {
    mockMenuItems[itemIndex] = {
      ...mockMenuItems[itemIndex],
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      categoryId: Number.parseInt(formData.get("categoryId") as string),
      preparationTime: Number.parseInt(formData.get("preparationTime") as string) || 15,
      available: formData.get("available") === "true",
      allergens: (formData.get("allergens") as string)
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a),
      updatedAt: new Date(),
    }
  }

  revalidatePath("/menu")
  return { success: true }
}

export async function deleteMenuItem(id: number) {
  mockMenuItems = mockMenuItems.filter((item) => item.id !== id)
  revalidatePath("/menu")
  return { success: true }
}

export async function toggleMenuItemAvailability(id: number) {
  const itemIndex = mockMenuItems.findIndex((item) => item.id === id)
  if (itemIndex !== -1) {
    mockMenuItems[itemIndex] = {
      ...mockMenuItems[itemIndex],
      available: !mockMenuItems[itemIndex].available,
      updatedAt: new Date(),
    }
  }

  revalidatePath("/menu")
  return { success: true }
}

export async function getMenuItems() {
  return mockMenuItems
}

// Utility function per logging attività
export async function logActivity(
  userId: number,
  action: string,
  entityType: string,
  entityId: number,
  details?: Record<string, any>,
) {
  // In produzione, salvare nel database
  console.log("Activity logged:", {
    userId,
    action,
    entityType,
    entityId,
    details,
    timestamp: new Date(),
  })
}

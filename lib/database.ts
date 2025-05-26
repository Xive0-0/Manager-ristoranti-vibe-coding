// Tipi TypeScript per il database
export interface User {
  id: number
  email: string
  name: string
  role: "admin" | "waiter" | "kitchen" | "manager"
  phone?: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Table {
  id: number
  number: number
  capacity: number
  status: "free" | "occupied" | "reserved" | "cleaning"
  positionX?: number
  positionY?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface MenuCategory {
  id: number
  name: string
  description?: string
  sortOrder: number
  active: boolean
  createdAt: Date
}

export interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  categoryId: number
  preparationTime: number
  available: boolean
  allergens: string[]
  imageUrl?: string
  rating: number
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  category?: MenuCategory
}

export interface Customer {
  id: number
  name: string
  phone?: string
  email?: string
  notes?: string
  totalVisits: number
  totalSpent: number
  createdAt: Date
  updatedAt: Date
}

export interface Reservation {
  id: number
  customerId?: number
  customerName: string
  customerPhone: string
  customerEmail?: string
  reservationDate: string
  reservationTime: string
  guests: number
  tableId?: number
  status: "confirmed" | "seated" | "completed" | "cancelled"
  notes?: string
  specialRequests?: string
  createdBy: number
  createdAt: Date
  updatedAt: Date
  customer?: Customer
  table?: Table
  createdByUser?: User
}

export interface Order {
  id: number
  orderNumber: string
  tableId?: number
  customerId?: number
  waiterId: number
  status: "preparing" | "ready" | "served" | "paid" | "cancelled"
  subtotal: number
  tax: number
  total: number
  paymentMethod?: string
  notes?: string
  estimatedTime?: number
  priority: "low" | "medium" | "high"
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  table?: Table
  customer?: Customer
  waiter?: User
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: number
  menuItemId: number
  quantity: number
  unitPrice: number
  totalPrice: number
  notes?: string
  status: "pending" | "preparing" | "ready" | "served"
  createdAt: Date
  updatedAt: Date
  menuItem?: MenuItem
}

export interface TableSession {
  id: number
  tableId: number
  waiterId: number
  startedAt: Date
  endedAt?: Date
  guestsCount?: number
  notes?: string
  table?: Table
  waiter?: User
}

export interface ActivityLog {
  id: number
  userId: number
  action: string
  entityType: string
  entityId: number
  details?: Record<string, any>
  createdAt: Date
  user?: User
}

export interface Setting {
  id: number
  key: string
  value: string
  description?: string
  updatedBy: number
  updatedAt: Date
  updatedByUser?: User
}

// Utility types per le query
export interface DashboardStats {
  totalTables: number
  occupiedTables: number
  dailyRevenue: number
  activeOrders: number
  avgServiceTime: number
  todayReservations: number
}

export interface KitchenStats {
  preparing: number
  ready: number
  overdue: number
  avgWaitTime: number
}

export interface ReservationStats {
  confirmed: number
  seated: number
  completed: number
  totalGuests: number
  total: number
}

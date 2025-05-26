-- Schema Database per Sistema Gestione Ristorante
-- PostgreSQL

-- Tabella Utenti (Staff del ristorante)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'waiter', 'kitchen', 'manager')),
    phone VARCHAR(20),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Tavoli
CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    number INTEGER UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'free' CHECK (status IN ('free', 'occupied', 'reserved', 'cleaning')),
    position_x DECIMAL(5,2), -- Coordinate per mappa visuale
    position_y DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Categorie Menu
CREATE TABLE menu_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Piatti Menu
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(8,2) NOT NULL,
    category_id INTEGER REFERENCES menu_categories(id),
    preparation_time INTEGER DEFAULT 15, -- minuti
    available BOOLEAN DEFAULT true,
    allergens TEXT[], -- Array di allergeni
    image_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Clienti
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    notes TEXT,
    total_visits INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Prenotazioni
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL, -- Denormalizzato per semplicità
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests INTEGER NOT NULL,
    table_id INTEGER REFERENCES tables(id),
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'seated', 'completed', 'cancelled')),
    notes TEXT,
    special_requests TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Ordini
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL, -- ORD-001, ORD-002, etc.
    table_id INTEGER REFERENCES tables(id),
    customer_id INTEGER REFERENCES customers(id),
    waiter_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'preparing' CHECK (status IN ('preparing', 'ready', 'served', 'paid', 'cancelled')),
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(50),
    notes TEXT,
    estimated_time INTEGER, -- minuti
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Tabella Items Ordine
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(8,2) NOT NULL,
    total_price DECIMAL(8,2) NOT NULL,
    notes TEXT, -- Note specifiche per questo item (es. "senza cipolla")
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Sessioni Tavolo (per tracking occupazione)
CREATE TABLE table_sessions (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES tables(id),
    waiter_id INTEGER REFERENCES users(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    guests_count INTEGER,
    notes TEXT
);

-- Tabella Log Attività (per audit trail)
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'order', 'table', 'reservation', etc.
    entity_id INTEGER NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Impostazioni Sistema
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indici per performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tables_updated_at BEFORE UPDATE ON tables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Dati di esempio
INSERT INTO users (email, password_hash, name, role, phone) VALUES
('admin@ristorante.com', '$2b$10$example', 'Mario Rossi', 'admin', '+39 333 1111111'),
('marco@ristorante.com', '$2b$10$example', 'Marco Bianchi', 'waiter', '+39 333 2222222'),
('sara@ristorante.com', '$2b$10$example', 'Sara Verdi', 'waiter', '+39 333 3333333'),
('chef@ristorante.com', '$2b$10$example', 'Giuseppe Neri', 'kitchen', '+39 333 4444444');

INSERT INTO tables (number, capacity, position_x, position_y) VALUES
(1, 2, 10.0, 10.0),
(2, 4, 30.0, 10.0),
(3, 2, 50.0, 10.0),
(4, 4, 70.0, 10.0),
(5, 4, 10.0, 30.0),
(6, 8, 30.0, 30.0),
(7, 2, 50.0, 30.0),
(8, 6, 70.0, 30.0),
(9, 6, 10.0, 50.0),
(10, 2, 30.0, 50.0),
(11, 4, 50.0, 50.0),
(12, 2, 70.0, 50.0);

INSERT INTO menu_categories (name, description, sort_order) VALUES
('Antipasti', 'Antipasti e stuzzichini', 1),
('Primi', 'Primi piatti', 2),
('Secondi', 'Secondi piatti', 3),
('Pizza', 'Pizze tradizionali e speciali', 4),
('Dessert', 'Dolci e dessert', 5),
('Bevande', 'Bevande e caffetteria', 6);

INSERT INTO menu_items (name, description, price, category_id, preparation_time, allergens) VALUES
('Pizza Margherita', 'Pomodoro, mozzarella, basilico fresco', 12.50, 4, 15, ARRAY['Glutine', 'Lattosio']),
('Pizza Diavola', 'Pomodoro, mozzarella, salame piccante', 15.50, 4, 15, ARRAY['Glutine', 'Lattosio']),
('Spaghetti Carbonara', 'Pasta, uova, guanciale, pecorino romano', 16.00, 2, 12, ARRAY['Glutine', 'Uova', 'Lattosio']),
('Risotto ai Funghi', 'Riso Carnaroli, funghi porcini, parmigiano', 18.00, 2, 20, ARRAY['Lattosio']),
('Bistecca alla Griglia', 'Manzo argentino, rosmarino, patate arrosto', 27.00, 3, 25, ARRAY[]::text[]),
('Antipasto della Casa', 'Selezione di salumi e formaggi locali', 18.00, 1, 5, ARRAY['Lattosio']),
('Tiramisù', 'Dolce tradizionale con mascarpone e caffè', 8.00, 5, 2, ARRAY['Glutine', 'Uova', 'Lattosio']),
('Caffè Espresso', 'Miscela arabica italiana', 2.50, 6, 1, ARRAY[]::text[]);

INSERT INTO settings (key, value, description) VALUES
('restaurant_name', 'Ristorante Da Mario', 'Nome del ristorante'),
('tax_rate', '0.22', 'Aliquota IVA'),
('service_charge', '0.10', 'Coperto per persona'),
('opening_time', '18:00', 'Orario di apertura'),
('closing_time', '24:00', 'Orario di chiusura'),
('max_reservation_days', '30', 'Giorni massimi per prenotazioni future');

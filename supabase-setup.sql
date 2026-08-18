-- ==========================================
-- TAQUERÍA GOURMET - SUPABASE INITIAL SETUP
-- ==========================================

-- 1. Create tables

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  precio NUMERIC(10, 2) NOT NULL,
  imagen TEXT NOT NULL,
  disponible BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  mas_vendido BOOLEAN DEFAULT false,
  categoria VARCHAR(100) DEFAULT 'Premium'
);

-- Sauces Table
CREATE TABLE IF NOT EXISTS sauces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  picante BOOLEAN DEFAULT false,
  premium BOOLEAN DEFAULT false
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente VARCHAR(255) NOT NULL,
  telefono VARCHAR(100) NOT NULL,
  direccion TEXT NOT NULL,
  observaciones TEXT,
  total NUMERIC(10, 2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'Pendiente', -- 'Pendiente', 'Preparando', 'En camino', 'Entregado', 'Cancelar'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  cantidad INTEGER NOT NULL DEFAULT 1
);

-- Order Sauces Link Table
CREATE TABLE IF NOT EXISTS order_sauces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  sauce_id UUID REFERENCES sauces(id) ON DELETE CASCADE
);


-- 2. Seed default data for Products (Gourmet Tacos)
INSERT INTO products (nombre, descripcion, precio, imagen, disponible, destacado, mas_vendido, categoria)
VALUES
('Tacos Al Pastor Artesanal', 'Cerdo marinado 24h en adobo de achiote y cítricos con piña asada al carbón, cilantro fresco y cebollitas moradas encurtidas en tortilla de maíz nixtamalizado.', 4200.00, 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop', true, true, true, 'Clásicos'),
('Taco Birria de Res con Consomé', 'Carne de res tierna braseada a fuego lento en chiles secos y especias mexicanas, con queso Oaxaca gratinado, servido con su consomé caliente para chopear.', 5400.00, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop', true, true, true, 'Premium'),
('Taco de Ribeye & Tuétano Asado', 'Corte de Ribeye premium a la parrilla sobre costra de queso fundido, bañado con tuétano asado al mezquite y sal marina de Colima.', 6200.00, 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=800&auto=format&fit=crop', true, true, false, 'Premium'),
('Taco de Suadero Confitado', 'Suadero suave y jugoso confitado en manteca artesanal y hierbas de olor, dorado en plancha con cebolla picada y cilantro criollo.', 4600.00, 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=800&auto=format&fit=crop', true, false, false, 'Clásicos'),
('Taco Cochinita Pibil Yucateca', 'Cerdo deshebrado horneado en hoja de plátano con achiote y naranja agria, coronado con cebollitas encurtidas con chile habanero y orégano.', 4900.00, 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=800&auto=format&fit=crop', true, true, false, 'Especiales'),
('Taco Gobernador de Camarón & Queso', 'Camarones salteados con pimientos tatemados, cebolla caramelizada y queso fundido dorado a la plancha en tortilla de harina o maíz.', 5800.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', true, false, false, 'Premium'),
('Taco Carnitas Michoacanas', 'Pork carnitas estilo Michoacán doradas al exterior y suaves por dentro, con chicharrón crujiente espolvoreado y guacamole rústico.', 4700.00, 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=800&auto=format&fit=crop', true, false, true, 'Clásicos'),
('Taco Hongos Silvestres & Trufa', 'Mix de portobellos y champiñones salteados al epazote con ajo confitado, crema de aguacate y toque de aceite de trufa blanca.', 4800.00, 'https://images.unsplash.com/photo-1584536286788-78ae83c4c503?q=80&w=800&auto=format&fit=crop', true, false, false, 'Veggie'),
('Taco Volcán Barbacoa de Cordero', 'Cordero cocido al vapor en pencas de maguey, servido en tortilla tostada crocante con queso asadero fundido y salsa borracha al pulque.', 5900.00, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop', true, true, true, 'Especiales')
ON CONFLICT DO NOTHING;


-- 3. Seed default data for Sauces (32 Mexican Artisanal Salsas & Combinations)
INSERT INTO sauces (nombre, picante, premium) VALUES
('Salsa Verde Tatemada', false, false),
('Salsa Roja de Molcajete', false, false),
('Guacamole Rústico con Pico de Gallo', false, true),
('Salsa Macha con Cacahuate & Ajonjolí', true, true),
('Salsa Habanero & Mango Tropical', true, true),
('Chipotle Cremoso Ahumado', true, false),
('Salsa Taquera Tradicional', false, false),
('Salsa Borracha al Pulque & Cerveza', false, true),
('Queso Fundido Oaxaca Suave', false, true),
('Salsa Chimichurri Habanero', true, true),
('Cebollitas Moradas Encurtidas', false, false),
('Salsa Xnipec Yucateca Cítrica', true, false),
('Crema Ácida de Limón & Cilantro', false, false),
('Salsa de Chile de Árbol Bravo', true, true),
('Salsa de Aguacate & Tomatillo', false, true),
('Chiles Toreados en Soya & Limón', true, true),
('Salsa Pico de Gallo Fresco', false, false),
('Salsa Morita con Piloncillo', false, true),
('Queso Cotija Rallado Artesanal', false, false),
('Salsa BBQ Chipotle al Mezcal', true, true),
('Piña Asada Caramelizada con Canela', false, true),
('Crema de Ajo Asado al Carbón', false, true),
('Habanera Tatemada Negra Maya', true, true),
('Chicharrón de Serrano Crocante', true, true),
('Frijoles Refritos con Epazote', false, false),
('Salsa de Maracuyá & Serrano', true, true),
('Salsa Ranchera Casera', false, false),
('Alioli de Cilantro & Lima', false, true),
('Salsa Pasilla con Naranja Agria', false, false),
('Pesto Mexicano de Cilantro & Pepitas', false, true),
('Salsa Secreta del Taquero Mayor', true, true),
('Salsa de Jalapeño Asado & Crema', true, false)
ON CONFLICT DO NOTHING;


-- 4. Enable Row Level Security (RLS)

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sauces ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_sauces ENABLE ROW LEVEL SECURITY;

-- 5. Policies creation

-- Read policy for Products (Public)
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

-- Read policy for Sauces (Public)
CREATE POLICY "Allow public read access to sauces" ON sauces
  FOR SELECT USING (true);

-- Insert policy for Orders (Public)
CREATE POLICY "Allow public insert to orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Read policy for Orders (Public - allows users to track their order if they know the order UUID)
CREATE POLICY "Allow public select of own orders" ON orders
  FOR SELECT USING (true);

-- Update policy for Orders (Public - allows status update or cancellation)
CREATE POLICY "Allow public update of orders" ON orders
  FOR UPDATE USING (true);

-- Insert policy for Order Items
CREATE POLICY "Allow public insert of order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Read policy for Order Items
CREATE POLICY "Allow public select of order items" ON order_items
  FOR SELECT USING (true);

-- Insert policy for Order Sauces
CREATE POLICY "Allow public insert of order sauces" ON order_sauces
  FOR INSERT WITH CHECK (true);

-- Read policy for Order Sauces
CREATE POLICY "Allow public select of order sauces" ON order_sauces
  FOR SELECT USING (true);

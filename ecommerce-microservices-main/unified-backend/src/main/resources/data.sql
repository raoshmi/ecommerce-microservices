-- =============================================================================
-- 🚀 E-COMMERCE MODULAR MONOLITH SEED DATA (POSTGRESQL)
-- =============================================================================

-- 1. Seed Users (passwords are BCrypt hash of "password")
INSERT INTO users (name, email, password, role, phone, address) VALUES
('Default Admin', 'admin@ecommerce.com', '$2a$10$8.UnVuG9HHgffUDKey.ZJuP3t1z/180eYIefE.9vL7Esk2v4e484G', 'ADMIN', '1234567890', 'Admin Office, Monolith HQ'),
('Default Customer', 'user@ecommerce.com', '$2a$10$8.UnVuG9HHgffUDKey.ZJuP3t1z/180eYIefE.9vL7Esk2v4e484G', 'CUSTOMER', '0987654321', '123 Monolith Lane, Monopolytown');

-- 2. Seed Categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic gadgets, laptops, phones and accessories'),
('Footwear', 'Running shoes, casual footwear, and sports boots'),
('Home Appliances', 'Essential items for smart kitchen and home management'),
('Accessories', 'Durable travel gear, backpacks, and daily accessories');

-- 3. Seed Products
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('Wireless Noise-Cancelling Headphones', 'Premium sound headphones with up to 30 hours of battery life and active noise canceling.', 129.99, 50, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'),
('Smart Fitness Watch', 'Heart rate tracking, GPS connectivity, and sleep analytics with 7-day battery life.', 199.99, 35, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'),
('Air Cushion Running Shoes', 'Maximum comfort and energy return cushioning for daily high performance workouts.', 89.99, 120, 'Footwear', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60'),
('Dual Heating Coffee Maker', 'Brew rich coffee with programmable controls and temperature-regulated warming plate.', 59.99, 15, 'Home Appliances', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=60'),
('Water-Resistant Commuter Backpack', 'Spacious multi-compartment pack with padded sleeve for laptops up to 15.6 inches.', 49.99, 80, 'Accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60'),
('RGB Mechanical Gaming Keyboard', 'Tactile blue switches with customizable vibrant RGB backlighting and premium build.', 79.99, 45, 'Electronics', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=60');

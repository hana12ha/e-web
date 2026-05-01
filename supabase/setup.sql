-- ============================================================
-- LUXE Store — Supabase Setup
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- ============================================================


-- ─────────────────────────────────────────
-- 1. TABLES
-- ─────────────────────────────────────────

-- Profiles (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name       TEXT,
  avatar     TEXT,
  role       TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  price           DECIMAL(10,2) NOT NULL,
  original_price  DECIMAL(10,2),
  rating          DECIMAL(3,2) DEFAULT 0,
  reviews         INTEGER DEFAULT 0,
  sold            INTEGER DEFAULT 0,
  stock           INTEGER DEFAULT 0,
  is_new          BOOLEAN DEFAULT false,
  is_best_seller  BOOLEAN DEFAULT false,
  colors          TEXT[] DEFAULT '{}',
  sizes           TEXT[] DEFAULT '{}',
  description     TEXT,
  features        TEXT[] DEFAULT '{}',
  images          TEXT[] DEFAULT '{}',
  tags            TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id             TEXT PRIMARY KEY,
  customer_name  TEXT,
  customer_email TEXT,
  items          JSONB DEFAULT '[]',
  total          DECIMAL(10,2),
  status         TEXT DEFAULT 'Processing',
  date           DATE DEFAULT CURRENT_DATE,
  address        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 2. ROW LEVEL SECURITY
-- ─────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

-- Profiles: each user can only access their own row
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products: public read, open write (admin panel uses anon key for now)
CREATE POLICY "products_select" ON products FOR SELECT USING (true);
DROP POLICY "products_all" ON products;                                              
CREATE POLICY "products_admin_write" ON products FOR ALL 
  USING (                                                                            
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));   

-- Orders: open for demo (in production, restrict to admin role)
CREATE POLICY "orders_all" ON orders FOR ALL USING (true);


-- ─────────────────────────────────────────
-- 3. AUTO-CREATE PROFILE ON SIGNUP
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar',
    'customer' -- default for all signups
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ─────────────────────────────────────────
-- 4. SEED — PRODUCTS (12 items)
-- ─────────────────────────────────────────

INSERT INTO products (name, category, price, original_price, rating, reviews, sold, stock, is_new, is_best_seller, colors, sizes, description, features, images, tags) VALUES

('Silk Draped Evening Gown', 'women', 289, 420, 4.8, 124, 340, 12, true, false,
 ARRAY['#1a1a1a','#c8a882','#8b6e52'], ARRAY['XS','S','M','L','XL'],
 'Elevate your evening with this luxurious silk draped gown. The fluid silhouette flatters every figure, while the delicate draping adds an artistic touch. Perfect for galas, formal dinners, or any occasion that calls for effortless sophistication.',
 ARRAY['100% Pure Silk','Hand-finished seams','Dry clean only','Made in Italy'],
 ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80','https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80','https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80'],
 ARRAY['luxury','formal','silk','gown']),

('Cashmere Oversized Blazer', 'women', 340, NULL, 4.9, 89, 215, 8, false, true,
 ARRAY['#2c2c2c','#8b7355','#c5b4a0'], ARRAY['XS','S','M','L'],
 'This oversized cashmere blazer redefines modern power dressing. The relaxed fit and premium cashmere blend create an effortlessly chic look that transitions seamlessly from boardroom to evening.',
 ARRAY['80% Cashmere, 20% Silk','Unstructured design','Dry clean only','Made in Scotland'],
 ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80','https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&q=80','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
 ARRAY['cashmere','blazer','luxury','oversized']),

('Leather Trench Coat', 'men', 595, 750, 4.7, 67, 178, 5, false, true,
 ARRAY['#1a1a1a','#3d2b1f','#6b4c3b'], ARRAY['S','M','L','XL','XXL'],
 'A masterpiece in full-grain leather, this trench coat is built to last a lifetime. The classic silhouette has been updated with contemporary details for a timeless yet modern aesthetic.',
 ARRAY['Full-grain Italian leather','Silk lining','Professional clean only','Made in France'],
 ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80','https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80','https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80'],
 ARRAY['leather','trench','coat','men']),

('Diamond Tennis Bracelet', 'accessories', 1250, 1600, 5.0, 45, 89, 3, true, false,
 ARRAY['#c0c0c0','#ffd700','#b87333'], ARRAY['15cm','17cm','19cm'],
 'This exquisite tennis bracelet features 3 carats of round brilliant diamonds set in 18K white gold. Each stone is meticulously selected for its exceptional clarity and brilliance.',
 ARRAY['3ct Total Diamond Weight','18K White Gold','F-G Color, VS Clarity','Certificate of Authenticity'],
 ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80','https://images.unsplash.com/photo-1573408301185-9519f94815b6?w=800&q=80','https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'],
 ARRAY['diamond','bracelet','gold','jewelry']),

('Italian Leather Loafers', 'shoes', 380, 480, 4.6, 92, 267, 15, false, false,
 ARRAY['#1a1a1a','#8b6914','#6b4c3b'], ARRAY['38','39','40','41','42','43','44','45'],
 'Crafted in our Florence atelier, these loafers embody the pinnacle of Italian shoemaking tradition. The hand-burnished leather develops a unique patina with wear, telling the story of its wearer.',
 ARRAY['Hand-welted construction','Full leather upper & lining','Leather sole with rubber heel','Made in Florence, Italy'],
 ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80','https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80','https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80'],
 ARRAY['shoes','leather','italian','loafers']),

('Structured Tote Bag', 'bags', 450, NULL, 4.9, 156, 423, 7, false, true,
 ARRAY['#1a1a1a','#f5f5f0','#8b6e52','#c8102e'], ARRAY['One Size'],
 'The ultimate everyday luxury, this structured tote is crafted from our signature pebbled leather. Spacious enough for everything you need, refined enough for any occasion.',
 ARRAY['Pebbled calfskin leather','Gold-tone hardware','Interior zip pocket','Made in Paris'],
 ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80','https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80','https://images.unsplash.com/photo-1594938298603-c8148c4b4deb?w=800&q=80'],
 ARRAY['bag','tote','leather','luxury']),

('Merino Wool Turtleneck', 'men', 185, 240, 4.7, 203, 512, 20, false, false,
 ARRAY['#1a1a1a','#c5b4a0','#2c4a6e','#3d5a40'], ARRAY['S','M','L','XL','XXL'],
 'Ultra-fine merino wool turtleneck that offers unparalleled softness without the itch. The slim ribbed design creates a sleek silhouette that works under blazers or on its own.',
 ARRAY['Extra fine Merino wool','Anti-pilling treatment','Machine washable','Made in New Zealand'],
 ARRAY['https://images.unsplash.com/photo-1559582798-678dfc71ccd8?w=800&q=80','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80','https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80'],
 ARRAY['merino','wool','turtleneck','knitwear']),

('Pearl & Gold Ear Climbers', 'accessories', 245, NULL, 4.8, 78, 189, 10, true, false,
 ARRAY['#ffd700','#c0c0c0'], ARRAY['One Size'],
 'These architectural ear climbers blend baroque freshwater pearls with 18K gold, creating a dramatic yet elegant statement. The climbing design hugs the ear for a modern, editorial look.',
 ARRAY['Freshwater Pearls','18K Gold Vermeil','Hypoallergenic','Handmade in New York'],
 ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80','https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=800&q=80','https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80'],
 ARRAY['earrings','pearl','gold','jewelry']),

('Pleated Wide-Leg Trousers', 'women', 195, 260, 4.5, 134, 298, 18, false, false,
 ARRAY['#f5f5f0','#1a1a1a','#8b7355','#c8a882'], ARRAY['XS','S','M','L','XL'],
 'These sculptural pleated trousers in lightweight crepe bring a tailored elegance to your wardrobe. The wide leg creates a fluid, elongating silhouette that moves beautifully.',
 ARRAY['100% Japanese Crepe','Side zip closure','Deep pockets','Made in Japan'],
 ARRAY['https://images.unsplash.com/photo-1594938374182-a47e5b4f7e47?w=800&q=80','https://images.unsplash.com/photo-1547177609-2b07ae5db8f3?w=800&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
 ARRAY['trousers','wide-leg','pleated','crepe']),

('Suede Chelsea Boots', 'shoes', 425, 520, 4.8, 167, 389, 9, false, true,
 ARRAY['#1a1a1a','#3d2b1f','#6b4c3b','#c8a882'], ARRAY['36','37','38','39','40','41','42'],
 'Our signature Chelsea boot in premium water-resistant suede. The sleek silhouette and elastic side panels make these the ideal everyday luxury boot, comfortable enough for hours of wear.',
 ARRAY['Premium water-resistant suede','Elastic side panels','Cushioned leather insole','Made in Spain'],
 ARRAY['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80','https://images.unsplash.com/photo-1542833455-a4aba3b3e8c2?w=800&q=80','https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80'],
 ARRAY['boots','suede','chelsea','shoes']),

('Wool-Cashmere Overcoat', 'men', 680, 890, 4.9, 56, 143, 4, false, false,
 ARRAY['#3d3d3d','#c5b4a0','#2c2c2c','#6b4c3b'], ARRAY['S','M','L','XL'],
 'This impeccably tailored overcoat in a refined wool-cashmere blend is the cornerstone of a considered wardrobe. The relaxed, double-breasted silhouette brings Italian sophistication to your outerwear.',
 ARRAY['60% Wool, 40% Cashmere','Fully lined with silk','Dry clean only','Made in Milan'],
 ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80','https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80','https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&q=80'],
 ARRAY['coat','cashmere','wool','overcoat']),

('Mini Crossbody Bag', 'bags', 295, NULL, 4.7, 231, 567, 14, true, true,
 ARRAY['#1a1a1a','#c8102e','#f5f5f0','#8b6e52','#c13def'], ARRAY['One Size'],
 'Our most-loved mini crossbody in smooth calfskin leather. The compact size belies its practicality — fit your phone, cards, and essentials for the perfect night-out companion.',
 ARRAY['Smooth calfskin leather','Adjustable chain strap','Magnetic closure','Made in Italy'],
 ARRAY['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80','https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80'],
 ARRAY['bag','crossbody','mini','leather']);


-- ─────────────────────────────────────────
-- 5. SEED — ORDERS (10 items)
-- ─────────────────────────────────────────

INSERT INTO orders (id, customer_name, customer_email, items, total, status, date, address) VALUES

('LX-8821', 'Sophie Martin', 'sophie@example.com',
 '[{"name":"Silk Draped Evening Gown","qty":1,"price":289}]',
 311.72, 'Delivered', '2026-03-01', '12 Rue de la Paix, Paris, France'),

('LX-8820', 'Marcus Chen', 'marcus@example.com',
 '[{"name":"Wool-Cashmere Overcoat","qty":1,"price":680},{"name":"Merino Wool Turtleneck","qty":2,"price":185}]',
 1134.00, 'In Transit', '2026-03-05', '88 Nathan Road, Hong Kong'),

('LX-8819', 'Isabella Romano', 'isabella@example.com',
 '[{"name":"Diamond Tennis Bracelet","qty":1,"price":1250}]',
 1350.00, 'Processing', '2026-03-08', 'Via della Spiga 22, Milan, Italy'),

('LX-8818', 'James Harrington', 'james@example.com',
 '[{"name":"Leather Trench Coat","qty":1,"price":595},{"name":"Italian Leather Loafers","qty":1,"price":380}]',
 1053.30, 'Delivered', '2026-02-28', '14 Savile Row, London, UK'),

('LX-8817', 'Amara Diallo', 'amara@example.com',
 '[{"name":"Structured Tote Bag","qty":1,"price":450}]',
 486.00, 'Delivered', '2026-02-25', '5 Avenue Montaigne, Paris, France'),

('LX-8816', 'Lena Vogel', 'lena@example.com',
 '[{"name":"Cashmere Oversized Blazer","qty":1,"price":340},{"name":"Pleated Wide-Leg Trousers","qty":1,"price":195}]',
 575.70, 'Shipped', '2026-03-10', 'Maximilianstrasse 12, Munich, Germany'),

('LX-8815', 'Ryo Tanaka', 'ryo@example.com',
 '[{"name":"Suede Chelsea Boots","qty":1,"price":425}]',
 459.00, 'Processing', '2026-03-11', '6-chome Ginza, Tokyo, Japan'),

('LX-8814', 'Clara Dubois', 'clara@example.com',
 '[{"name":"Pearl & Gold Ear Climbers","qty":2,"price":245}]',
 528.60, 'In Transit', '2026-03-07', 'Bahnhofstrasse 8, Zurich, Switzerland'),

('LX-8813', 'Noah Williams', 'noah@example.com',
 '[{"name":"Mini Crossbody Bag","qty":1,"price":295}]',
 318.60, 'Delivered', '2026-02-20', '350 5th Ave, New York, USA'),

('LX-8812', 'Elena Petrov', 'elena@example.com',
 '[{"name":"Silk Draped Evening Gown","qty":1,"price":289},{"name":"Diamond Tennis Bracelet","qty":1,"price":1250}]',
 1664.52, 'Cancelled', '2026-02-18', 'Tverskaya Street, Moscow, Russia');

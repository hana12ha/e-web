// ============================================================
//  ORDERS API — Backend Connection Point
// ============================================================
//
//  Currently uses mock data stored in localStorage.
//
//  To connect your own backend, replace each function body:
//
//  REST API example:
//    export const getOrders = async () => {
//      const res = await fetch('/api/orders', {
//        headers: { Authorization: `Bearer ${token}` },
//      })
//      return res.json()
//    }
//
//  Supabase example:
//    export const getOrders = async () => {
//      const { data } = await supabase.from('orders').select('*')
//      return data
//    }
//
// ============================================================

export const MOCK_ORDERS = [
  {
    id: 'ORD-8821',
    customer: { name: 'Sophie Martin', email: 'sophie@example.com' },
    items: [{ name: 'Silk Draped Evening Gown', qty: 1, price: 289 }],
    total: 311.72,
    status: 'Delivered',
    date: '2026-03-01',
    address: '12 Rue de la Paix, Paris, France',
  },
  {
    id: 'ORD-8820',
    customer: { name: 'Marcus Chen', email: 'marcus@example.com' },
    items: [
      { name: 'Wool-Cashmere Overcoat', qty: 1, price: 680 },
      { name: 'Merino Wool Turtleneck', qty: 2, price: 185 },
    ],
    total: 1134.00,
    status: 'In Transit',
    date: '2026-03-05',
    address: '88 Nathan Road, Hong Kong',
  },
  {
    id: 'ORD-8819',
    customer: { name: 'Isabella Romano', email: 'isabella@example.com' },
    items: [{ name: 'Diamond Tennis Bracelet', qty: 1, price: 1250 }],
    total: 1350.00,
    status: 'Processing',
    date: '2026-03-08',
    address: 'Via della Spiga 22, Milan, Italy',
  },
  {
    id: 'ORD-8818',
    customer: { name: 'James Harrington', email: 'james@example.com' },
    items: [
      { name: 'Leather Trench Coat', qty: 1, price: 595 },
      { name: 'Italian Leather Loafers', qty: 1, price: 380 },
    ],
    total: 1053.30,
    status: 'Delivered',
    date: '2026-02-28',
    address: '14 Savile Row, London, UK',
  },
  {
    id: 'ORD-8817',
    customer: { name: 'Amara Diallo', email: 'amara@example.com' },
    items: [{ name: 'Structured Tote Bag', qty: 1, price: 450 }],
    total: 486.00,
    status: 'Delivered',
    date: '2026-02-25',
    address: '5 Avenue Montaigne, Paris, France',
  },
  {
    id: 'ORD-8816',
    customer: { name: 'Lena Vogel', email: 'lena@example.com' },
    items: [
      { name: 'Cashmere Oversized Blazer', qty: 1, price: 340 },
      { name: 'Pleated Wide-Leg Trousers', qty: 1, price: 195 },
    ],
    total: 575.70,
    status: 'Shipped',
    date: '2026-03-10',
    address: 'Maximilianstrasse 12, Munich, Germany',
  },
  {
    id: 'ORD-8815',
    customer: { name: 'Ryo Tanaka', email: 'ryo@example.com' },
    items: [{ name: 'Suede Chelsea Boots', qty: 1, price: 425 }],
    total: 459.00,
    status: 'Processing',
    date: '2026-03-11',
    address: '6-chome Ginza, Tokyo, Japan',
  },
  {
    id: 'ORD-8814',
    customer: { name: 'Clara Dubois', email: 'clara@example.com' },
    items: [{ name: 'Pearl & Gold Ear Climbers', qty: 2, price: 245 }],
    total: 528.60,
    status: 'In Transit',
    date: '2026-03-07',
    address: 'Bahnhofstrasse 8, Zurich, Switzerland',
  },
  {
    id: 'ORD-8813',
    customer: { name: 'Noah Williams', email: 'noah@example.com' },
    items: [{ name: 'Mini Crossbody Bag', qty: 1, price: 295 }],
    total: 318.60,
    status: 'Delivered',
    date: '2026-02-20',
    address: '350 5th Ave, New York, USA',
  },
  {
    id: 'ORD-8812',
    customer: { name: 'Elena Petrov', email: 'elena@example.com' },
    items: [
      { name: 'Silk Draped Evening Gown', qty: 1, price: 289 },
      { name: 'Diamond Tennis Bracelet', qty: 1, price: 1250 },
    ],
    total: 1664.52,
    status: 'Cancelled',
    date: '2026-02-18',
    address: 'Tverskaya Street, Moscow, Russia',
  },
]

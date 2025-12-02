CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orderId TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  profileLink TEXT,
  items TEXT NOT NULL,
  price REAL NOT NULL,
  status TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE INDEX idx_orderId ON orders(orderId);
CREATE INDEX idx_createdAt ON orders(createdAt);
CREATE INDEX idx_status ON orders(status);

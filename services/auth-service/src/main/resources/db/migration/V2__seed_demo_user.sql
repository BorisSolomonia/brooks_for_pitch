INSERT INTO users (id, email, handle, display_name, password_hash, status)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo@brooks.app',
  'demo',
  'Demo User',
  '$2a$10$7EqJtq98hPqEX7fNZaFWoOa4Z6WQ6znJNeSQ1C0d2Z9r1VQ1L/4Qm',
  'ACTIVE'
)
ON CONFLICT DO NOTHING;

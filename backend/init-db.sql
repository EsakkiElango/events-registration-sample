CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  details TEXT,
  startTime TEXT,
  endTime TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming',
  orderIndex INTEGER NOT NULL DEFAULT 0
);

INSERT INTO events(title, details, startTime, endTime, status, orderIndex) VALUES
('Welcome Meetup', 'Intro event', '2025-12-01T10:00:00Z', '2025-12-01T12:00:00Z', 'current', 1),
('Workshop A', 'Hands-on workshop', '2025-12-05T09:00:00Z', '2025-12-05T11:00:00Z', 'upcoming', 2),
('Closing Session', 'Wrap-up', '2025-12-10T15:00:00Z', '2025-12-10T16:00:00Z', 'upcoming', 3);

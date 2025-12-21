CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tokenNo INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  eventDetails TEXT,
  mobileNo INTEGER,
  startTime TEXT,
  endTime TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming',
  orderIndex INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- INSERT INTO events(tokenNo,title, eventDetails,mobileNo, startTime, endTime, status, orderIndex) VALUES
-- (1,'Welcome Meetup', 'Intro event',0000, '2025-12-01T10:00:00Z', '2025-12-01T12:00:00Z', 'current', 1),
-- (2,'Workshop A', 'Hands-on workshop',0000, '2025-12-05T09:00:00Z', '2025-12-05T11:00:00Z', 'upcoming', 2),
-- (3,'Closing Session', 'Wrap-up',0000, '2025-12-10T15:00:00Z', '2025-12-10T16:00:00Z', 'upcoming', 3);

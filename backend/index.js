const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { Database } = require('sqlite3');

const DB_PATH = path.join(__dirname, 'events.db');
const INIT_SQL = fs.readFileSync(path.join(__dirname, 'init-db.sql'), 'utf8');

const SECRET = 'change_this_secret_in_prod';

// init db if not exists
const db = new Database(DB_PATH);
db.serialize(() => {
  db.exec(INIT_SQL);
});

const runAsync = (sql, params=[]) => new Promise((resolve,reject)=>{
  db.run(sql, params, function(err){
    if(err) reject(err); else resolve(this);
  });
});
const allAsync = (sql, params=[]) => new Promise((resolve,reject)=>{
  db.all(sql, params, (err,rows)=> err?reject(err):resolve(rows));
});
const getAsync = (sql, params=[]) => new Promise((resolve,reject)=>{
  db.get(sql, params, (err,row)=> err?reject(err):resolve(row));
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// static users
const USERS = {
  admin: { password: 'Cho@csi.', role: 'admin' },
  user: { password: 'dman98', role: 'user' }
};

app.post('/api/login', (req,res)=>{
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: 'username & password required' });
  const u = USERS[username];
  if(!u || u.password !== password) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ username, role: u.role }, SECRET, { expiresIn: '8h' });
  res.json({ token, username, role: u.role });
});

function auth(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({ error: 'missing authorization' });
  const token = h.split(' ')[1];
  try{
    const p = jwt.verify(token, SECRET);
    req.user = p;
    next();
  } catch(e){
    return res.status(401).json({ error: 'invalid token' });
  }
}

app.get('/api/events', auth, async (req,res)=>{
  const rows = await allAsync('SELECT * FROM events ORDER BY orderIndex ASC');
  res.json(rows);
});

app.post('/api/events', auth, async (req,res)=>{
  const { tokenNo, title, eventDetails, mobileNo, startTime, endTime } = req.body;
  const row = await getAsync('SELECT MAX(orderIndex) as maxI FROM events');
  const next = (row && row.maxI) ? row.maxI + 1 : 1;
  await runAsync('INSERT INTO events(tokenNo,title, eventDetails,mobileNo, startTime, endTime, status, orderIndex) VALUES(?,?,?,?,?,?,?,?)',
    [tokenNo,title, eventDetails, mobileNo,startTime, endTime, 'upcoming', next]);
  const inserted = await getAsync('SELECT * FROM events WHERE id = last_insert_rowid()');
  res.json(inserted);
});

app.put('/api/events/:id', auth, async (req,res)=>{
  const id = req.params.id;
  const { tokenNo,title, eventDetails, mobileNo,status, startTime, endTime } = req.body;
  await runAsync('UPDATE events SET tokenNo=?, title=?, eventDetails=?, mobileNo=?, startTime=?, endTime=?, status=? WHERE id=?', [tokenNo,title, eventDetails, mobileNo,startTime, endTime, status, id]);
  const updated = await getAsync('SELECT * FROM events WHERE id=?', [id]);
  res.json(updated);
});

app.delete('/api/events/:id', auth, async (req,res)=>{
  const id = req.params.id;
  await runAsync('DELETE FROM events WHERE id=?', [id]);
  res.json({ success: true });
});

app.post('/api/events/reorder', auth, async (req,res)=>{
  const arr = req.body;
  await new Promise((resolve,reject)=>{
    db.serialize(()=>{
      db.run('BEGIN TRANSACTION');
      const stmt = db.prepare('UPDATE events SET orderIndex=? WHERE id=?');
      for(const item of arr){
        stmt.run(item.orderIndex, item.id);
      }
      stmt.finalize();
      db.run('COMMIT', (err)=> err?reject(err):resolve());
    });
  });
  res.json({ success: true });
});

app.post('/api/events/:id/complete', auth, async (req,res)=>{
  const id = req.params.id;
  await runAsync('UPDATE events SET status = ? WHERE id = ?', ['completed', id]);
  // clear current
  await runAsync("UPDATE events SET status='upcoming' WHERE status='current'");
  const next = await getAsync("SELECT * FROM events WHERE status='upcoming' ORDER BY orderIndex ASC LIMIT 1");
  if(next){
    await runAsync("UPDATE events SET status='current' WHERE id=?", [next.id]);
  }
  const events = await allAsync('SELECT * FROM events ORDER BY orderIndex ASC');
  res.json(events);
});

app.get('/api/events/current-next', async (req,res)=>{
  const current = await getAsync("SELECT * FROM events WHERE status='current' LIMIT 1");
  const next = await allAsync("SELECT * FROM events WHERE status='upcoming' ORDER BY orderIndex ASC LIMIT 3");
  res.json({ current, next });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> console.log('Backend listening on', PORT));

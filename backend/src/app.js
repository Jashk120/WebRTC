import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from "http";
import { initializeSocketIO } from './socket/index.js';
import { db } from './db/index.js';
import { UserTable } from './models/users.schema.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);

app.set("io", io);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

app.get('/',(req, res)=>{
  res.sendFile(`${process.cwd()}/index.html`);
})
app.post('/create', async (req, res) => {
    const { name, age, email } = req.body; // destructuring values from the request body
  
    if (!name || !age || !email) {
      return res.status(400).json({ message: 'Name, age, and email are required.' });
    }
  
    try {
      // Insert the new user into the database using drizzle ORM
      const result = await db.insert(UserTable).values({ name, age, email });
  
      res.status(201).json({ message: 'User created successfully', user: result });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  });

// Initialize socket.io

initializeSocketIO(io);  

export { httpServer };



import dotenv from 'dotenv';
import { httpServer } from './app.js';
import { db } from './db/index.js';
import { UserTable } from './models/users.schema.js'; 

dotenv.config({
  path: './.env',
});



// Start the server
httpServer.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}\nLink: http://localhost:${process.env.PORT}`);
});

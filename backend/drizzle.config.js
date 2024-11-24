import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
console.log(process.env.DATABASE_URL)
dotenv.config({
    path: './.env', 
});

export default defineConfig({
  out: './drizzle',
  schema: './src/models/users.schema.js',
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});

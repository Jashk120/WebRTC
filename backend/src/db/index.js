import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../models/users.schema.js"
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL)
export const db = drizzle(client,{schema, logger: true})
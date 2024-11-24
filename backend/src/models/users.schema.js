import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const UserTable = pgTable("users", {
  id:uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

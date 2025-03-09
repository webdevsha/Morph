import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  persona: text("persona"),
  region: text("region"),
  progress: jsonb("progress"),
  skills: text("skills").array()
});

export const pathways = pgTable("pathways", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  steps: jsonb("steps").notNull(),
  prerequisites: text("prerequisites").array(),
  outcomes: text("outcomes").array()
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  template: jsonb("template")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  persona: true,
  region: true
});

export const insertPathwaySchema = createInsertSchema(pathways);
export const insertToolSchema = createInsertSchema(tools);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Pathway = typeof pathways.$inferSelect;
export type Tool = typeof tools.$inferSelect;

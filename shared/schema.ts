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
  difficulty: text("difficulty").notNull(),
  duration: text("duration").notNull(),
  category: text("category").notNull(),
  persona: text("persona"), // Which persona this pathway is designed for
  steps: jsonb("steps").notNull(),
  dependencies: jsonb("dependencies"), // IDs of pathways that must be completed first
  skills_required: text("skills_required").array(),
  skills_gained: text("skills_gained").array(),
  resources: jsonb("resources"), // Array of linked resources
  related_concepts: jsonb("related_concepts"), // Related topics and concepts
  ecosystem_links: jsonb("ecosystem_links"), // External ecosystem connections
  completion_criteria: jsonb("completion_criteria")
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // article, video, course, etc.
  url: text("url").notNull(),
  description: text("description"),
  provider: text("provider"), // e.g., "AI Safety Fundamentals", "BlueDot"
  tags: text("tags").array(),
  difficulty: text("difficulty"),
  pathway_id: integer("pathway_id").references(() => pathways.id)
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  template: jsonb("template")
});

// Schema types
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  persona: true,
  region: true
});

export const insertPathwaySchema = createInsertSchema(pathways);
export const insertToolSchema = createInsertSchema(tools);
export const insertResourceSchema = createInsertSchema(resources);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Pathway = typeof pathways.$inferSelect;
export type Tool = typeof tools.$inferSelect;
export type Resource = typeof resources.$inferSelect;

// Visualization types
export type PathwayNode = {
  id: string;
  type: 'pathway' | 'resource' | 'skill' | 'concept';
  data: {
    title: string;
    description?: string;
    difficulty?: string;
    duration?: string;
    category?: string;
    provider?: string;
    url?: string;
    completion?: number;
  };
  position: { x: number; y: number };
};

export type PathwayEdge = {
  id: string;
  source: string;
  target: string;
  type: 'dependency' | 'resource' | 'skill' | 'concept';
  label?: string;
  animated?: boolean;
};
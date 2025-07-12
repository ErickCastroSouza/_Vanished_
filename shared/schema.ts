import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  missingPersons: many(missingPersons),
}));

export const missingPersons = pgTable("missing_persons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  height: text("height"),
  bloodType: text("blood_type"),
  characteristics: text("characteristics"),
  lastLocation: text("last_location").notNull(),
  lastSeenDate: timestamp("last_seen_date").notNull(),
  disappearanceCircumstances: text("disappearance_circumstances"),
  status: text("status").notNull().default("missing"),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  contactEmail: text("contact_email"),
  reportedBy: integer("reported_by").notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const missingPersonsRelations = relations(missingPersons, ({ one, many }) => ({
  reporter: one(users, {
    fields: [missingPersons.reportedBy],
    references: [users.id],
  }),
  successStories: many(successStories),
}));

export const successStories = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  missingPersonId: integer("missing_person_id").notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const successStoriesRelations = relations(successStories, ({ one }) => ({
  missingPerson: one(missingPersons, {
    fields: [successStories.missingPersonId],
    references: [missingPersons.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

export const insertMissingPersonSchema = createInsertSchema(missingPersons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSuccessStorySchema = createInsertSchema(successStories).omit({
  id: true,
  createdAt: true,
});

export const searchMissingPersonSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  status: z.string().optional(),
  lastSeenDate: z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  })
  .transform((val) => new Date(val))
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MissingPerson = typeof missingPersons.$inferSelect;
export type InsertMissingPerson = z.infer<typeof insertMissingPersonSchema>;
export type SuccessStory = typeof successStories.$inferSelect;
export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;
export type SearchMissingPersonParams = z.infer<typeof searchMissingPersonSchema>;

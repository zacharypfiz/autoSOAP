import { type getNotes } from "@/lib/api/notes/queries";
import { nanoid, timestamps } from "@/lib/utils";
import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const notes = pgTable("notes", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  content: text("content").notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for notes - used to validate API requests
const baseSchema = createSelectSchema(notes).omit(timestamps);

export const insertNoteSchema = createInsertSchema(notes).omit(timestamps);
export const insertNoteParams = baseSchema.extend({}).omit({
  id: true,
  userId: true,
});

export const updateNoteSchema = baseSchema;
export const updateNoteParams = baseSchema.extend({}).omit({
  userId: true,
});
export const noteIdSchema = baseSchema.pick({ id: true });

// Types for notes - used to type API request params and within Components
export type Note = typeof notes.$inferSelect;
export type NewNote = z.infer<typeof insertNoteSchema>;
export type NewNoteParams = z.infer<typeof insertNoteParams>;
export type UpdateNoteParams = z.infer<typeof updateNoteParams>;
export type NoteId = z.infer<typeof noteIdSchema>["id"];

// this type infers the return from getNotes() - meaning it will include any joins
export type CompleteNote = Awaited<
  ReturnType<typeof getNotes>
>["notes"][number];

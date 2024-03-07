import type { NoteId } from "@/lib/db/schema/notes";
import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { noteIdSchema, notes } from "@/lib/db/schema/notes";
import { and, eq } from "drizzle-orm";

export const getNotes = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, session?.user.id!));
  const n = rows;
  return { notes: n };
};

export const getNoteById = async (id: NoteId) => {
  const { session } = await getUserAuth();
  const { id: noteId } = noteIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, session?.user.id!)));
  if (row === undefined) return {};
  const n = row;
  return { note: n };
};

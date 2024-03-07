"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/notes/useOptimisticNotes";
import NoteWithRichTextEditor from "@/components/notes/NoteEditor";
import NoteForm from "@/components/notes/NoteForm";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { type Note } from "@/lib/db/schema/notes";
import { cn } from "@/lib/utils";

export default function OptimisticNote({ note }: { note: Note }) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Note) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticNote, setOptimisticNote] = useOptimistic(note);
  const updateNote: TAddOptimistic = (input) =>
    setOptimisticNote({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <NoteForm
          note={optimisticNote}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateNote}
        />
      </Modal>
      <div className="mb-4 flex items-end justify-between">
        <h1 className="text-2xl font-semibold">{optimisticNote.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "text-wrap break-all rounded-lg bg-secondary p-4",
          optimisticNote.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticNote, null, 2)}
        <NoteWithRichTextEditor note={optimisticNote} />
      </pre>
    </div>
  );
}

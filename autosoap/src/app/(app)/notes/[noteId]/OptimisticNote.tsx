"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/notes/useOptimisticNotes";
import { type Note } from "@/lib/db/schema/notes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import NoteForm from "@/components/notes/NoteForm";
import NoteWithRichTextEditor from "@/components/notes/NoteEditor";


export default function OptimisticNote({
  note,

}: {
  note: Note;


}) {
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
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticNote.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticNote.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticNote, null, 2)}
        <NoteWithRichTextEditor note={optimisticNote} />
      </pre>
    </div>
  );
}

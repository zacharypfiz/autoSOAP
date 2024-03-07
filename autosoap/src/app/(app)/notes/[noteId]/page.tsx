import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getNoteById } from "@/lib/api/notes/queries";
import OptimisticNote from "./OptimisticNote";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";
import NoteWithRichTextEditor from "@/components/notes/NoteEditor";


export const revalidate = 0;

export default async function NotePage({
  params,
}: {
  params: { noteId: string };
}) {

  return (
    <main className="overflow-auto">
      <Note id={params.noteId} />
    </main>
  );
}

const Note = async ({ id }: { id: string }) => {
  await checkAuth();

  const { note } = await getNoteById(id);


  if (!note) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="notes" />
        <OptimisticNote note={note} />
      </div>
    </Suspense>
  );
};

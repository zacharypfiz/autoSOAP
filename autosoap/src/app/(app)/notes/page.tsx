import { Suspense } from "react";
import Loading from "@/app/loading";
import NoteList from "@/components/notes/NoteList";
import { getNotes } from "@/lib/api/notes/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function NotesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="my-2 text-2xl font-semibold">Notes</h1>
        </div>
        <Notes />
      </div>
    </main>
  );
}

const Notes = async () => {
  await checkAuth();

  const { notes } = await getNotes();

  return (
    <Suspense fallback={<Loading />}>
      <NoteList notes={notes} />
    </Suspense>
  );
};

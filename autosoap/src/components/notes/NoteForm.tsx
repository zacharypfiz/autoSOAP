import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/notes/useOptimisticNotes";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";




import { type Note, insertNoteParams } from "@/lib/db/schema/notes";
import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "@/lib/actions/notes";


const NoteForm = ({
  
  note,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  note?: Note | null;
  
  openModal?: (note?: Note) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Note>(insertNoteParams);
  const editing = !!note?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("notes");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Note },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Note ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const noteParsed = await insertNoteParams.safeParseAsync({  ...payload });
    if (!noteParsed.success) {
      setErrors(noteParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = noteParsed.data;
    const pendingNote: Note = {
      updatedAt: note?.updatedAt ?? new Date(),
      createdAt: note?.createdAt ?? new Date(),
      id: note?.id ?? "",
      userId: note?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingNote,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateNoteAction({ ...values, id: note.id })
          : await createNoteAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingNote 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={note?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.content ? "text-destructive" : "",
          )}
        >
          Content
        </Label>
        <Input
          type="text"
          name="content"
          className={cn(errors?.content ? "ring ring-destructive" : "")}
          defaultValue={note?.content ?? ""}
        />
        {errors?.content ? (
          <p className="text-xs text-destructive mt-2">{errors.content[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: note });
              const error = await deleteNoteAction(note.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: note,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default NoteForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};

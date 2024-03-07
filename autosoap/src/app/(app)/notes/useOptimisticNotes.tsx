import { useOptimistic } from "react";
import { type CompleteNote, type Note } from "@/lib/db/schema/notes";
import { OptimisticAction } from "@/lib/utils";

export type TAddOptimistic = (action: OptimisticAction<Note>) => void;

export const useOptimisticNotes = (notes: CompleteNote[]) => {
  const [optimisticNotes, addOptimisticNote] = useOptimistic(
    notes,
    (
      currentState: CompleteNote[],
      action: OptimisticAction<Note>,
    ): CompleteNote[] => {
      const { data } = action;

      const optimisticNote = {
        ...data,

        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticNote]
            : [...currentState, optimisticNote];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticNote } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticNote, optimisticNotes };
};

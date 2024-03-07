"use client";

// import { EditorContent, EditorRoot } from "novel";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { useDebounce } from "use-debounce"; // Replace with your actual debounce library
import React, { useState, useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { updateNoteAction } from "@/lib/actions/notes";

type NoteProps = {
    note: {
        content: string;
        name: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    };
};

const NoteWithRichTextEditor = ({ note }: NoteProps) => {
    const editor = useEditor({
        content: "<p>Your initial content here</p>",
        extensions: [StarterKit,],
    });

    const [content, setContent] = useState(note.content || ""); // Content state to be updated by the editor

    const [debouncedContent] = useDebounce(content, 500);


    useEffect(() => {
        // Call your function to update the content in the database when the debouncedContent changes
        updateNoteAction({
            content: debouncedContent,
            name: note.name || "",
            id: note.id || ""
        });
    }, [debouncedContent]);

    return (
        <div>
            <EditorContent editor={editor} />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <p>Actual value: {content}</p>
            <p>Debounce value: {debouncedContent}</p>
        </div>
    );
};

export default NoteWithRichTextEditor;
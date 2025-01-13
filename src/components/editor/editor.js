import React, { useState, useEffect } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";

import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { FaHighlighter } from "react-icons/fa";
import { PiListBulletsBold } from "react-icons/pi";

import styles from "./editor.module.css";

const CustomBulletList = BulletList.extend({
  renderHTML({ HTMLAttributes }) {
    return ["ul", { ...HTMLAttributes, style: "list-style-type: disc" }, 0];
  },
});

const Tiptap = ({ editorContent, onChange }) => {
  const [content, setContent] = useState(
    editorContent || "<p>Start your notes here...</p>"
  );

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      ListItem,
      CustomBulletList,
      Highlight,
      Underline,
      Bold,
      Italic,
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: styles.inputBox,
      },
    },
    parseOptions: {
      preserveWhitespace: "full",
    },
    content: editorContent,
    onBlur: ({ editor }) => {
      const html = editor.getHTML();

      if (onChange) {
        onChange(html);
      }
    },
  });

  useEffect(() => {
    if (editor && editorContent !== editor.getHTML()) {
      editor.commands.setContent(editorContent);
    }
  }, [editor, editorContent]);

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.editor}>
      <div className={styles.flex}>
        {/* Bold Button */}
        <button
          type="button"
          onClick={() => {
            if (editor.state.selection.empty) {
              alert("Please select some text first.");
            } else {
              editor.chain().focus().toggleBold().run();
            }
          }}
          className={editor.isActive("bold") ? styles["is-active"] : ""}
        >
          <FaBold />
        </button>

        {/* Italic Button */}
        <button
          type="button"
          onClick={() => {
            if (editor.state.selection.empty) {
              alert("Please select some text first.");
            } else {
              editor.chain().focus().toggleItalic().run();
            }
          }}
          className={editor.isActive("italic") ? styles["is-active"] : ""}
        >
          <FaItalic />
        </button>

        {/* Underline Button */}
        <button
          type="button"
          onClick={() => {
            if (editor.state.selection.empty) {
              alert("Please select some text first.");
            } else {
              editor.chain().focus().toggleUnderline().run();
            }
          }}
          className={editor.isActive("underline") ? styles["is-active"] : ""}
        >
          <FaUnderline />
        </button>

        {/* Heading */}
        <button
          type="button"
          onClick={() => {
            if (editor.state.selection.empty) {
              alert("Please select some text first.");
            } else {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }
          }}
          className={
            editor.isActive("heading", { level: 1 }) ? styles["is-active"] : ""
          }
        >
          H1
        </button>

        <button
          type="button"
          onClick={() => {
            if (editor.state.selection.empty) {
              alert("Please select some text first.");
            } else {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }
          }}
          className={
            editor.isActive("heading", { level: 2 }) ? styles["is-active"] : ""
          }
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => {
            if (editor.state.selection.empty) {
              alert("Please select some text first.");
            } else {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }
          }}
          className={
            editor.isActive("heading", { level: 3 }) ? styles["is-active"] : ""
          }
        >
          H3
        </button>

        {/* Highlight button */}
        <button
          type="button"
          onClick={() => {
            if (editor.state.selection.empty) {
              alert("Please select some text first.");
            } else {
              editor.chain().focus().toggleHighlight().run();
            }
          }}
          className={editor.isActive("highlight") ? styles["is-active"] : ""}
        >
          <FaHighlighter />
        </button>

        {/* Bullet List Button */}
        <button
          type="button"
          onClick={() => {
            if (editor.state.selection.empty) {
              alert("Please select some text first.");
            } else {
              editor.chain().focus().toggleBulletList().run();
            }
          }}
          className={editor.isActive("bulletList") ? styles["is-active"] : ""}
        >
          <PiListBulletsBold />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};
export default Tiptap;

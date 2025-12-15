"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useState } from "react";
import FontSize from "./FontSize";

export default function ToolbarEditor() {
  const [fontSize, setFontSize] = useState("16px");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: `

<div style="max-width: 800px; margin: 0 auto; border: 1px solid #ccc; padding: 20px;">
        <h1 style="text-align: center; color: #f4a261;">Terms And Condition</h1>
        <button style="float: right; background-color: #f4a261; color: white; border: none; padding: 5px 10px; cursor: pointer;">Edit</button>

        <div style="margin-bottom: 20px;">
            <h2 style="margin-top: 0;">1. Terms of Service</h2>
            <p style="margin: 0;">By using Phlebotomist services, you agree to provide accurate healthcare services in accordance with professional standards and applicable regulations. This agreement establishes the framework with our partnership.</p>
            <div style="margin-top: 10px;">
                <h3 style="margin: 0;">Key Points:</h3>
                <ul style="list-style-type: disc; padding-left: 20px; margin: 5px 0;">
                    <li style="margin: 5px 0;">Professional liability coverage required</li>
                    <li style="margin: 5px 0;">Compliance with HIPAA regulations</li>
                    <li style="margin: 5px 0;">24-hour cancellation policy</li>
                </ul>
            </div>
        </div>

        <div style="margin-bottom: 20px;">
            <h2 style="margin-top: 0;">2. Payment Policies</h2>
            <p style="margin: 0;">Payment terms are Net 15 days from service completion. Direct deposit is our preferred payment method, with payments processed bi-weekly.</p>
            <div style="background-color: #f9e7d9; padding: 10px; margin-top: 10px;">
                <p style="margin: 0; color: #2a9d8f;"><strong>Average processing time: 2-3 business days</strong></p>
            </div>
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <p style="margin: 0;">The agreement is governed by state healthcare regulations. Both parties acknowledge understanding of their rights and responsibilities under this partnership.</p>
            <button style="background-color: #f4a261; color: white; border: none; padding: 10px 20px; cursor: pointer;">Next</button>
        </div>
    </div>
 
`,
  });

  if (!editor) return null;

  return (
    <div
      style={{ fontFamily: "Montserrat" }}
      className=" mx-auto p-4  rounded-lg "
    >
      {/* Toolbar */}
      <div className="flex gap-2 mb-2 pb-2 items-center">
        {/* Font size dropdown */}
        <select
          value={fontSize}
          onChange={(e) => {
            setFontSize(e.target.value);
            editor.chain().focus().setFontSize(e.target.value).run();
          }}
          className="border rounded px-2 py-1"
        >
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="20px">20</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
        </select>

        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded border ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          }`}
        >
          B
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded border ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          }`}
        >
          I
        </button>

        {/* Underline */}
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded border ${
            editor.isActive("underline") ? "bg-gray-300" : ""
          }`}
        >
          U
        </button>

        {/* Align Left */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="px-2 py-1 rounded border"
        >
          ⬅
        </button>

        {/* Align Center */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="px-2 py-1 rounded border"
        >
          ⬌
        </button>

        {/* Align Right */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="px-2 py-1 rounded border"
        >
          ➡
        </button>

        {/* Justify */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className="px-2 py-1 rounded border"
        >
          ☰
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        style={{ outline: "none" }}
        className="prose max-w-none p-2 min-h-[150px] ring-0 focus:ring-0 focus-visible:outline-none  rounded"
      />
    </div>
  );
}

/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/#installation/NoRgTANARGB0DsCrQGwA40AYCs8CcYWeAzCAStiiACyYHZorEFrbZjibJQCmAdskigIICJhFiRAXWh4AhnhQ8weKFKA=
 */

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  BalloonEditor,
  Autosave,
  Essentials,
  Paragraph,
  AutoImage,
  Autoformat,
  ImageBlock,
  BlockQuote,
  Heading,
  ImageInsertViaUrl,
  ImageStyle,
  ImageToolbar,
  ImageInline,
  Indent,
  IndentBlock,
  Link,
  LinkImage,
  List,
  Table,
  TableToolbar,
  TextTransformation,
  MediaEmbed,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Subscript,
  Superscript,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Highlight,
  HorizontalLine,
  CodeBlock,
  Alignment,
  Style,
  GeneralHtmlSupport,
  HtmlComment,
  BalloonToolbar,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

// import ckeditorContentCss from "./text-editor.css";
/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = "GPL"; // or <YOUR_LICENSE_KEY>.

export default function TextEditor(
  { htmlElement, onChange, isEditable = false },
  ref
) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null); // DOM container ref
  const editorInstanceRef = useRef(null); // CKEditor instance ref
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  // Reflect external editability changes onto the editor instance
  //   useEffect(() => {
  //     const inst = editorInstanceRef.current;
  //     if (inst) {
  //     //   inst.isReadOnly = !isEditable;
  //     }
  //   }, [isEditable]);

  // Expose imperative API to parent via ref: getHtml, setHtml, setReadOnly
  useImperativeHandle(ref, () => ({
    getHtml: () => {
      const inst = editorInstanceRef.current;
      return inst ? inst.getData() : htmlElement || "";
    },
    setHtml: (html) => {
      const inst = editorInstanceRef.current;
      if (inst) inst.setData(html ?? "");
    },
  }));

  // If the parent changes `htmlElement`, update the editor content unless it's already the same.
  useEffect(() => {
    const inst = editorInstanceRef.current;
    if (!inst) return;
    const current = inst.getData();
    const incoming = htmlElement ?? "";
    if (incoming !== current) {
      // Update editor content without moving selection to start
      inst.model.change((writer) => {
        inst.setData(incoming);
      });
    }
  }, [htmlElement]);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) return {};

    return {
      editorConfig: {
        // contentsCss: [ckeditorContentCss],
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "style",
            "|",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "subscript",
            "superscript",
            "code",
            "|",
            "horizontalLine",
            "link",
            "insertImageViaUrl",
            "mediaEmbed",
            "insertTable",
            "highlight",
            "blockQuote",
            "codeBlock",
            "|",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "outdent",
            "indent",
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Alignment,
          Autoformat,
          AutoImage,
          Autosave,
          BalloonToolbar,
          BlockQuote,
          Bold,
          Code,
          CodeBlock,
          Essentials,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          GeneralHtmlSupport,
          Heading,
          Highlight,
          HorizontalLine,
          HtmlComment,
          ImageBlock,
          ImageInline,
          ImageInsertViaUrl,
          ImageStyle,
          ImageToolbar,
          Indent,
          IndentBlock,
          Italic,
          Link,
          LinkImage,
          List,

          MediaEmbed,
          Paragraph,

          Strikethrough,
          Style,
          Subscript,
          Superscript,
          Table,
          TableToolbar,
          TextTransformation,
          Underline,
        ],
        balloonToolbar: [
          "bold",
          "italic",
          "|",
          "link",
          "|",
          "bulletedList",
          "numberedList",
        ],
        fontFamily: {
          supportAllValues: true,
        },
        fontSize: {
          options: [10, 12, 14, "default", 18, 20, 22],
          supportAllValues: true,
        },
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            },
          ],
        },
        htmlSupport: {
          allow: [
            {
              name: /^.*$/,
              styles: true,
              attributes: true,
              classes: true,
            },
          ],
        },
        image: {
          toolbar: [
            "imageStyle:inline",
            "imageStyle:wrapText",
            "imageStyle:breakText",
          ],
        },
        initialData: htmlElement ?? ``,
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: "https://",
          decorators: {
            toggleDownloadable: {
              mode: "manual",
              label: "Downloadable",
              attributes: {
                download: "file",
              },
            },
          },
        },
        placeholder: "Type or paste your content here!",
        style: {
          definitions: [
            {
              name: "Article category",
              element: "h3",
              classes: ["category"],
            },
            {
              name: "Title",
              element: "h2",
              classes: ["document-title"],
            },
            {
              name: "Subtitle",
              element: "h3",
              classes: ["document-subtitle"],
            },
            {
              name: "Info box",
              element: "p",
              classes: ["info-box"],
            },
            {
              name: "CTA Link Primary",
              element: "a",
              classes: ["button", "button--green"],
            },
            {
              name: "CTA Link Secondary",
              element: "a",
              classes: ["button", "button--black"],
            },

            {
              name: "Spoiler",
              element: "span",
              classes: ["spoiler"],
            },
          ],
        },
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
      },
    };
  }, [isLayoutReady]);

  return (
    <div className="main-container !text-white rounded-lg">
      <div
        className="editor-container editor-container_balloon-editor editor-container_include-style"
        ref={editorContainerRef}
      >
        <div className="editor-container__editor">
          <div ref={editorRef} className="">
            <style>
              {`
			  /* ===============================
   🎨 CKEditor Custom Styles
   =============================== */

/* Remove borders from editor when focused */
.editor-container {
  border: none !important;
}
  ..ck.ck-editor__editable_inline > *:first-child
Specificity: (0,3,0)
			  {margin:0 !important;}

.ck.ck-editor__editable.ck-focused:not(.ck-editor__nested-editable) {
  outline: none;
  border: none;
  box-shadow: var(--ck-inner-shadow), 0 0;
}
  .editor-container__editor{
  padding:0 !important;
  }

.ck-content {
  color: white;
}

/* ===============================
   📦 Layout Containers
   =============================== */

.main-container {
  width: 100%;
//   padding: 1rem;
}

.editor-container {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
  color: white;
}

.editor-container_balloon-editor {
  /* Optional: Add custom balloon editor styles here */
}

.editor-container_include-style {
  /* Optional: Styles for include-style variant */
}

.editor-container__editor {
  min-height: 300px;
  padding: 1rem;
}

.editor-container__editor .ck-editor__editable {
  min-height: 250px;
}

/* ===============================
   📝 CKEditor Content Reset
   =============================== */

.ckeditor-content {
  all: revert; /* Removes Tailwind overrides */
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #222;
}

.ckeditor-content p {
  margin-bottom: 1em;
}

.ckeditor-content ul,
.ckeditor-content ol {
  margin: 1em 0;
  padding-left: 2em;
}

.ckeditor-content blockquote {
  border-left: 4px solid #ccc;
  padding-left: 1em;
  color: #555;
  margin: 1em 0;
}

.ckeditor-content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.ckeditor-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.ckeditor-content th,
.ckeditor-content td {
  border: 1px solid #ddd;
  padding: 8px;
}

/* ===============================
   🌐 General Styles (ckeditor-content.css)
   =============================== */

body {
  font-family: system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #222;

}

/* Headings */
h1 {
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  font-weight: bold;
}

h2 {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  font-weight: bold;
}

h3 {
  display: block;
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  font-weight: bold;
}

h4 {
  display: block;
  margin-block-start: 1.33em;
  margin-block-end: 1.33em;
  font-weight: bold;
}

h5 {
  display: block;
  font-size: 0.83em;
  margin-block-start: 1.67em;
  margin-block-end: 1.67em;
  font-weight: bold;
}

h6 {
  display: block;
  font-size: 0.67em;
  margin-block-start: 2.33em;
  margin-block-end: 2.33em;
  font-weight: bold;
}

/* Paragraphs */
p {
  margin-bottom: 1em;
}

/* Lists */
ul,
ol {
  margin: 1em 0;
  padding-left: 2em;
}

li {
  margin-bottom: 0.25em;
}

/* Links */
a {
  color: #0d6efd;
  text-decoration: none;
}

/* Blockquotes */
blockquote {
  border-left: 4px solid #ccc;
  padding-left: 1em;
  color: #555;
  margin: 1em 0;
}

/* Images */
img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/* Tables */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

/* Code Blocks */
pre {
  background: #f6f6f6;
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
}

code {
  font-family: monospace;
  background: #f6f6f6;
  padding: 2px 4px;
  border-radius: 4px;
}

/* Horizontal Line */
hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 2em 0;
}

			  
`}
            </style>
            {editorConfig && isEditable && (
              <CKEditor
                editor={BalloonEditor}
                config={editorConfig}
                onReady={(editor) => {
                  editorInstanceRef.current = editor;
                  // initialize editor data and read-only state
                  if (htmlElement) editor.setData(htmlElement);
                }}
                onChange={(_event, editor) => {
                  const data = editor.getData();
                  if (typeof onChange === "function") onChange(data);
                }}
              />
            )}
            {!isEditable && (
              <div dangerouslySetInnerHTML={{ __html: htmlElement }}></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

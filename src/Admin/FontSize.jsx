import { Mark, mergeAttributes } from "@tiptap/core";

const FontSize = Mark.create({
  name: "fontSize",

  addAttributes() {
    return {
      size: {
        default: "16px",
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.size) {
            return {};
          }
          return { style: `font-size: ${attributes.size}` };
        },
      },
    };
  },

  parseHTML() {
    return [{ style: "font-size" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) => {
          return chain().setMark(this.name, { size }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().unsetMark(this.name).run();
        },
    };
  },
});

export default FontSize;

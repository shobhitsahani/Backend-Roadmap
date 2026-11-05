import { createCn } from "cn/config";

const customFontSizes = [
  "micro",
  "label",
  "caption",
  "body",
  "body-lg",
  "title-sm",
  "title",
  "display-sm",
  "display",
  "readout",
] as const;

export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: [...customFontSizes] }],
    },
  },
});

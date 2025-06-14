import { cva } from "class-variance-authority";

export const bgColorVariants = cva("", {
  variants: {
    color: {
      green: ["bg-green-600", "hover:bg-green-700"],
      red: ["bg-red-600", "hover:bg-red-700"],
      yellow: ["bg-yellow-600", "hover:bg-yellow-700"],
      purple: ["bg-purple-600", "hover:bg-purple-700"],
    },
  },
});

export const textColorVariants = cva("", {
  variants: {
    color: {
      green: ["text-green-600", "hover:text-green-700"],
      red: ["text-red-600", "hover:text-red-700"],
      yellow: ["text-yellow-600", "hover:text-yellow-700"],
      purple: ["text-purple-600", "hover:text-purple-700"],
    },
  },
});

export const borderColorVariants = cva("", {
  variants: {
    color: {
      green: ["border-green-600", "hover:border-green-700"],
      red: ["border-red-600", "hover:border-red-700"],
      yellow: ["border-yellow-600", "hover:border-yellow-700"],
      purple: ["border-purple-600", "hover:border-purple-700"],
    },
  },
});

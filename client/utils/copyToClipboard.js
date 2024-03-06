// UNUSED

import { toast } from "react-toastify";

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  toast.success(`✔ Successfuly copied "${text}" to clipboard.`, {
    toastId: text,
  });
}

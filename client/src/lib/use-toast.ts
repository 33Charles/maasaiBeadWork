// src/lib/use-toast.ts
import { toast } from "react-toastify";

export function useToast() {
  return {
    toast: toast,
  };
}
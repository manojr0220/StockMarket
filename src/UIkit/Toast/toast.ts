import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define a type for toast types
type ToastType = "success" | "error" | "info" | "warning" | "default";

// Function to trigger toast notifications
export const notify = (
  message: string,
  type: ToastType = "default",
  duration: number = 5000
) => {
  const options: ToastOptions = {
    autoClose: duration,
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warn(message, options);
      break;
    default:
      toast(message, options);
  }
};

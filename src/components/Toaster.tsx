import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./Toast";
import { FaCheckCircle } from "react-icons/fa";
import { useToast } from "../components/utils/useToast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-white justify-between">
            <div className="flex gap-3 items-center">
              <FaCheckCircle className="text-green-500 w-6 h-6" />
              <div className="grid gap-1">
                {title && (
                  <ToastTitle className="font-lato-bold">{title}</ToastTitle>
                )}
                {description && (
                  <ToastDescription className="font-lato-regular">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className="text-gray-700" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";
import { usePageContext } from "../utils/usePageContext";
import { Textarea } from "../Textarea";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  initialValue?: string;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  minLen?: number;
  maxLen?: number;
  required?: boolean;
  submitButtonLabel?: string;
  placeholder?: string;
}

const TextareaForm = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      id,
      label,
      minLen,
      maxLen,
      initialValue,
      onCancel,
      required,
      submitButtonLabel,
      placeholder,
      ...props
    },
    ref
  ) => {
    const { setFormData } = usePageContext();

    const minLength = minLen ?? (required ? 1 : 0);
    const maxLength = maxLen ?? 1000;
    const formSchema = z.object({
      [id]: z
        .string()
        .min(minLength, {
          message: required
            ? `${label} is required`
            : `${label} must be at least ${minLength} characters`,
        })
        .max(maxLen ?? 1000, {
          message: `${label} must be less than ${maxLength} characters`,
        }),
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        [id]: initialValue ?? "",
      },
    });

    // 2. Define a submit handler.
    const handleSubmit = (values: z.infer<typeof formSchema>) => {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      setFormData((prev) => ({
        ...prev,
        [id]: values[id],
      }));
      form.reset();
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      form.resetField(id);
      onCancel?.(e);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-lato-bold text-base">
                  {label}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    {...field}
                    placeholder={placeholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            className="px-4 py-3 mt-4 bg-gray-700 justify-center items-center flex flex-1 w-full border-none focus:outline-none "
            formAction="submit"
          >
            <div className="text-white text-base font-lato-regular">
              {submitButtonLabel ?? "Save"}
            </div>
          </button>
          <div className="px-4 justify-center items-center flex">
            <button
              className="text-blue text-base font-lato-regular hover:underline"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </Form>
    );
  }
);
TextareaForm.displayName = "TextareaForm";

export default TextareaForm;

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
import { useEntity } from "../utils/useEntityContext";
import { Textarea } from "../Textarea";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  initialValue?: string;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  minLen?: number;
  maxLen?: number;
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
      ...props
    },
    ref
  ) => {
    const { setFormData } = useEntity();

    const formSchema = z.object({
      [id]: z.string(),
      // .min(minLen ?? 2)
      // .max(maxLen ?? 50),
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
      console.log(values);
      setFormData((prev) => ({
        ...prev,
        [id]: values[id],
      }));
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
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            className="px-4 py-3 mt-4 bg-gray-700 justify-center items-center flex flex-1 w-full border-none focus:outline-none "
            formAction="submit"
          >
            <div className="text-white text-base font-lato-regular">Save</div>
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

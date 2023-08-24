import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as React from "react";
import { Form, FormField, FormLabel } from "./Form";
import { useEntity } from "../utils/useEntityContext";

import { HolidayHourType } from "@/src/types/yext";
import HolidayHourFormItem from "./HolidayHourFormItem";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface HoursFormProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  initialHolidayHours?: {
    holidayHours: HolidayHourType[];
  };
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
}

// TODO: multiple intervals
// TODO: initial values when switching from open to closed
// TODO: Time validation (aka start < end)
const HolidayHoursForm = React.forwardRef<HTMLInputElement, HoursFormProps>(
  (
    { className, type, id, label, initialHolidayHours, onCancel, ...props },
    ref
  ) => {
    const { setFormData } = useEntity();

    // Schema for TimeInterval
    const TimeIntervalSchema = z.object({
      start: z.string(),
      end: z.string(),
    });

    // Schema for HolidayHour
    const HolidayHourSchema = z.object({
      date: z.string(),
      isClosed: z.optional(z.boolean()),
      openIntervals: z.optional(z.array(TimeIntervalSchema)),
    });

    // Schema for the form
    const formSchema = z.object({
      [id]: z.object({
        holidayHours: z.array(HolidayHourSchema),
      }),
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        [id]: initialHolidayHours ?? {},
      },
    });

    const onValueChange = (index: number, value: HolidayHourType) => {
      const holidayHours = form.getValues(id).holidayHours;
      // replace the value at the index
      holidayHours[index] = value;
      form.setValue(`${id}.holidayHours[${index}]`, value);
    };

    const onDelete = (
      e: React.MouseEvent<HTMLButtonElement>,
      index: number
    ) => {
      const holidayHours = form.getValues(id).holidayHours;
      holidayHours.splice(index, 1);
      form.setValue(`${id}.holidayHours[${index}]`, null);
    };

    // // 2. Define a submit handler.
    const handleSubmit = (values: z.infer<typeof formSchema>) => {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      setFormData((prev) => ({
        ...prev,
        [id]: values[id],
      }));
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      form.reset();
      onCancel?.(e);
    };

    return (
      <Form {...form}>
        <FormLabel className="font-lato-bold text-base">{label}</FormLabel>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 mt-4"
        >
          {form.getValues(id).holidayHours.map((holidayHour, index) => (
            <FormField
              control={form.control}
              name={`${id}.holidayHours[${index}]`}
              render={({ field }) => (
                <HolidayHourFormItem
                  label={`Holiday Hours ${index + 1}`}
                  key={index}
                  index={index}
                  onValueChange={onValueChange}
                  holidayHourValue={field.value}
                  onDelete={onDelete}
                />
              )}
            />
          ))}
          <button
            formAction="submit"
            className="px-4 py-3 mt-4 bg-gray-700 justify-center items-center flex flex-1 w-full border-none focus:outline-none "
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
HolidayHoursForm.displayName = "HoursForm";

export default HolidayHoursForm;

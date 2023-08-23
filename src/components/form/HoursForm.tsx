import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as React from "react";
import { Form, FormField, FormLabel } from "./Form";
import { useEntity } from "../utils/useEntityContext";
import { DayIntervalType } from "@/src/types/yext";
import IntervalFormCard from "./IntervalFormItem";

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
  initialHours?: {
    monday: DayIntervalType;
    tuesday: DayIntervalType;
    wednesday: DayIntervalType;
    thursday: DayIntervalType;
    friday: DayIntervalType;
    saturday: DayIntervalType;
    sunday: DayIntervalType;
  };
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
}

export const isClosedInterval = (
  interval: any
): interval is { isClosed: boolean } => {
  return "isClosed" in interval;
};

// TODO: multiple intervals
// TODO: initial values when switching from open to closed
// TODO: Time validation (aka start < end)
const HoursForm = React.forwardRef<HTMLInputElement, HoursFormProps>(
  ({ className, type, id, label, initialHours, onCancel, ...props }, ref) => {
    const { setFormData } = useEntity();

    // Schema for TimeInterval
    const TimeIntervalSchema = z.object({
      start: z.string(),
      end: z.string(),
    });

    // Schema for DayInterval
    const DayIntervalSchema = z.union([
      z.object({
        openIntervals: z.array(TimeIntervalSchema),
      }),
      z.object({
        isClosed: z.boolean(),
      }),
    ]);

    // Schema for HolidayHour
    const HolidayHourSchema = z.object({
      date: z.string(),
      isClosed: z.optional(z.boolean()),
      openIntervals: z.optional(z.array(TimeIntervalSchema)),
    });

    // Schema for the form
    const formSchema = z.object({
      [id]: z.object({
        monday: DayIntervalSchema,
        tuesday: DayIntervalSchema,
        wednesday: DayIntervalSchema,
        thursday: DayIntervalSchema,
        friday: DayIntervalSchema,
        saturday: DayIntervalSchema,
        sunday: DayIntervalSchema,
      }),
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        [id]: initialHours ?? {},
      },
    });

    // // 2. Define a submit handler.
    // const handleSubmit = (values: z.infer<typeof formSchema>) => {
    //   // Do something with the form values.
    //   // ✅ This will be type-safe and validated.
    //   console.log(values);
    //   setFormData((prev) => ({
    //     ...prev,
    //     [id]: values[id],
    //   }));
    // };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      form.resetField(id);
      onCancel?.(e);
    };

    const onValueChange = (dayOfWeek: DayOfWeek, value: DayIntervalType) => {
      // console.log(dayOfWeek, value);
      if (value.isClosed) {
        form.setValue(`${id}.${dayOfWeek}`, { isClosed: true });
      } else {
        form.setValue(`${id}.${dayOfWeek}`, {
          openIntervals: [
            {
              start: value.openIntervals[0].start,
              end: value.openIntervals[0].end,
            },
          ],
        });
      }
    };

    return (
      <Form {...form}>
        <FormLabel className="font-lato-bold text-base">{label}</FormLabel>
        <form
          // onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 mt-4"
        >
          <FormField
            control={form.control}
            name={"hours.monday"}
            render={({ field }) => (
              <IntervalFormCard
                day="monday"
                onValueChange={onValueChange}
                value={field.value}
              />
            )}
          />
          <FormField
            control={form.control}
            name={"hours.tuesday"}
            render={({ field }) => (
              <IntervalFormCard
                day="tuesday"
                onValueChange={onValueChange}
                value={field.value}
              />
            )}
          />
          <FormField
            control={form.control}
            name={"hours.wednesday"}
            render={({ field }) => (
              <IntervalFormCard
                day="wednesday"
                onValueChange={onValueChange}
                value={field.value}
              />
            )}
          />
          <FormField
            control={form.control}
            name={"hours.thursday"}
            render={({ field }) => (
              <IntervalFormCard
                day="thursday"
                onValueChange={onValueChange}
                value={field.value}
              />
            )}
          />
          <FormField
            control={form.control}
            name={"hours.friday"}
            render={({ field }) => (
              <IntervalFormCard
                day="friday"
                onValueChange={onValueChange}
                value={field.value}
              />
            )}
          />
          <FormField
            control={form.control}
            name={"hours.saturday"}
            render={({ field }) => (
              <IntervalFormCard
                day="saturday"
                onValueChange={onValueChange}
                value={field.value}
              />
            )}
          />
          <FormField
            control={form.control}
            name={"hours.sunday"}
            render={({ field }) => (
              <IntervalFormCard
                day="sunday"
                onValueChange={onValueChange}
                value={field.value}
              />
            )}
          />
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
HoursForm.displayName = "HoursForm";

export default HoursForm;

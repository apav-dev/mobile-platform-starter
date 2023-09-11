import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as React from "react";
import { Form, FormField, FormLabel } from "./Form";
import { usePageContext } from "../utils/usePageContext";
import { HolidayHourFormItem } from "./HolidayHourFormItem";
import { DayIntervalSchema, HolidayHourSchema } from "../../schemas/hours";

import { DayIntervalType, HolidayHourType } from "../../types/yext";

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
    monday: DayIntervalType;
    tuesday: DayIntervalType;
    wednesday: DayIntervalType;
    thursday: DayIntervalType;
    friday: DayIntervalType;
    saturday: DayIntervalType;
    sunday: DayIntervalType;
    holidayHours?: HolidayHourType[];
  };
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
}

export const HolidayHoursForm = React.forwardRef<
  HTMLInputElement,
  HoursFormProps
>(
  (
    { className, type, id, label, initialHolidayHours, onCancel, ...props },
    ref
  ) => {
    const { setFormData } = usePageContext();

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
      holidayHours[index] = value;
      form.setValue(`${id}.holidayHours`, holidayHours);
    };

    const handleDeleteHolidayHours = (
      e: React.MouseEvent<HTMLButtonElement>,
      index: number
    ) => {
      const holidayHours = form.getValues(id).holidayHours;
      holidayHours.splice(index, 1);
      form.setValue(`${id}.holidayHours`, holidayHours);
    };

    const handleAddHolidayHours = () => {
      const holidayHours = form.getValues(id).holidayHours;
      const today = new Date();
      holidayHours.push({
        date: today.toISOString().split("T")[0],
        isClosed: true,
      });
      form.setValue(`${id}.holidayHours`, holidayHours);
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
      setFormData((prev: Record<string, any>) => ({
        ...prev,
        [id]: values[id],
      }));
      form.reset();
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      form.reset();
      onCancel?.(e);
    };

    return (
      <Form {...form}>
        <FormLabel className="font-lato-bold text-base">{label}</FormLabel>
        <button
          type="button"
          onClick={handleAddHolidayHours}
          className="px-4 my-3 py-3 bg-zinc-200 rounded-[3px] justify-center items-center gap-2 flex w-full font-lato-regular"
        >
          + Add Holiday Hours
        </button>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-3 mt-4"
        >
          <FormField
            control={form.control}
            name={`${id}.holidayHours`}
            render={({ field }) => (
              <>
                {field.value.map((holidayHour, index) => (
                  <FormField
                    key={index}
                    name={`${id}.holidayHours.${index}`}
                    control={form.control}
                    render={({ field }) => (
                      <HolidayHourFormItem
                        label={`Holiday Hours ${index + 1}`}
                        key={index}
                        index={index}
                        onValueChange={onValueChange}
                        value={holidayHour}
                        onDelete={handleDeleteHolidayHours}
                      />
                    )}
                  />
                ))}
              </>
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
              type="button"
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

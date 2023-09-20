import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormLabel } from "./Form";
import { usePageContext } from "../utils/usePageContext";
import { DayIntervalType, HolidayHourType } from "../../types/yext";
import { IntervalFormItem } from "./IntervalFormItem";
import { DayIntervalSchema, HolidayHourSchema } from "../../schemas/hours";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

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
    holidayHours: HolidayHourType[];
  };
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
}

export const isClosedInterval = (
  interval: any
): interval is { isClosed: boolean } => {
  return "isClosed" in interval;
};

const HoursForm = React.forwardRef<HTMLInputElement, HoursFormProps>(
  ({ className, type, id, label, initialHours, onCancel, ...props }, ref) => {
    const { setFormData } = usePageContext();
    const { t } = useTranslation();

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

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        [id]: initialHours ?? {},
      },
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
      console.log(values);
      setFormData((prev: Record<string, any>) => ({
        ...prev,
        [id]: values[id],
      }));
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      form.reset();
      onCancel?.(e);
    };

    const onValueChange = (
      dayOfWeek: DayOfWeek,
      value: DayIntervalType,
      changeToOpen?: boolean
    ) => {
      if (value.isClosed) {
        form.setValue(`${id}.${dayOfWeek}`, { isClosed: true });
      } else {
        // if changeToOpen is true, then we are changing from closed to open. set the openIntervals to their original values if they exist and if not, set them to an empty array
        if (changeToOpen) {
          form.setValue(`${id}.${dayOfWeek}`, {
            openIntervals: initialHours?.[dayOfWeek].openIntervals ?? [
              { start: "", end: "" },
            ],
          });
        } else {
          form.setValue(`${id}.${dayOfWeek}`, value);
        }
      }
    };

    return (
      <Form {...form}>
        <FormLabel className="font-lato-bold text-base">{label}</FormLabel>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-3 mt-4"
        >
          <FormField
            control={form.control}
            name={id}
            render={({ field }) => (
              <>
                {Object.keys(field.value)
                  .filter((day) => day !== "holidayHours")
                  // sort days of week mon-sun
                  .sort((a, b) => {
                    const days = [
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ];
                    return days.indexOf(a) - days.indexOf(b);
                  })
                  .map((day) => {
                    return (
                      <FormControl>
                        <FormField
                          control={form.control}
                          name={`${id}.${day}`}
                          render={({ field }) => (
                            <IntervalFormItem
                              key={uuidv4()}
                              day={day as DayOfWeek}
                              onValueChange={onValueChange}
                              value={field.value}
                            />
                          )}
                        />
                      </FormControl>
                    );
                  })}
              </>
            )}
          />
          <button
            formAction="submit"
            className="px-4 py-3 mt-4 bg-gray-700 justify-center items-center flex flex-1 w-full border-none focus:outline-none "
          >
            <div className="text-white text-base font-lato-regular">
              {t("Save")}
            </div>
          </button>
          <div className="px-4 justify-center items-center flex">
            <button
              className="text-blue text-base font-lato-regular hover:underline"
              onClick={handleCancel}
              type="button"
            >
              {t("Cancel")}
            </button>
          </div>
        </form>
      </Form>
    );
  }
);
HoursForm.displayName = "HoursForm";

export default HoursForm;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as React from "react";
import { Form, FormControl, FormField, FormLabel } from "./Form";
import { useEntity } from "../utils/useEntityContext";
import { DayIntervalType } from "@/src/types/yext";
import IntervalFormCard from "./IntervalFormItem";
import { validateTime } from "../../utils/validateTime";

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

const HoursForm = React.forwardRef<HTMLInputElement, HoursFormProps>(
  ({ className, type, id, label, initialHours, onCancel, ...props }, ref) => {
    const { setFormData } = useEntity();

    // Schema for TimeInterval
    const TimeIntervalSchema = z
      .object({
        start: z.string().refine((value) => validateTime(value, "start"), {
          message: "Invalid time interval",
        }),
        end: z.string().refine((value) => validateTime(value, "end"), {
          message: "Invalid time interval",
        }),
      })
      .refine((data) => data.start <= data.end, {
        message: "Start time cannot be before the end time",
        path: ["start"],
      });

    // Schema for DayInterval
    const DayIntervalSchema = z
      .union([
        z.object({
          openIntervals: z.array(TimeIntervalSchema),
        }),
        z.object({
          isClosed: z.boolean(),
        }),
      ])
      .refine(
        (data) => {
          if ("isClosed" in data && data.isClosed && "openIntervals" in data) {
            return false;
          }
          return true;
        },
        {
          message: "If a day is closed, it cannot have any open intervals.",
        }
      )
      .refine(
        (data) => {
          if ("openIntervals" in data) {
            const intervals = data.openIntervals;
            for (let i = 0; i < intervals.length; i++) {
              for (let j = i + 1; j < intervals.length; j++) {
                if (
                  intervals[i].start < intervals[j].end &&
                  intervals[i].end > intervals[j].start
                ) {
                  return false; // overlapping interval found
                }
              }
            }
          }
          return true;
        },
        {
          message: "Overlapping intervals are not allowed.",
        }
      );

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

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        [id]: initialHours ?? {},
      },
    });

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
                            <IntervalFormCard
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

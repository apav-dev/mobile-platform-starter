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
import { Input } from "../Input";
import { useEntity } from "../utils/useEntityContext";
import { DayIntervalType } from "@/src/types/yext";
import { RadioGroup, RadioGroupItem } from "../Radio";
import Card from "../Card";
import { Label } from "../Label";

type DayOfWeek =
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

const renderHoursFormCard = (
  day: DayOfWeek,
  onValueChange: (dayOfWeek: DayOfWeek, interval: DayIntervalType) => void,
  value: (
    | {
        openIntervals: {
          start: string;
          end: string;
        }[];
      }
    | {
        isClosed: boolean;
      }
  ) &
    (
      | {
          openIntervals: {
            start: string;
            end: string;
          }[];
        }
      | {
          isClosed: boolean;
        }
      | undefined
    )
) => {
  const onRadioChange = (value: string) => {
    if (value === "closed") {
      onValueChange(day, { isClosed: true });
    } else {
      onValueChange(day, {
        openIntervals: [
          {
            start: "9:00",
            end: "5:00",
          },
        ],
      });
    }
  };

  const onStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(day, {
      openIntervals: [
        {
          start: e.target.value,
          end: value.openIntervals[0].end,
        },
      ],
    });
  };

  const onEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(day, {
      openIntervals: [
        {
          start: value.openIntervals[0].start,
          end: e.target.value,
        },
      ],
    });
  };

  const dayOfWeekLabel = day.charAt(0).toUpperCase() + day.slice(1);

  let startValue = isClosedInterval(value)
    ? "09:00"
    : value.openIntervals[0].start;
  startValue = startValue.length === 4 ? `0${startValue}` : startValue;

  let endValue = isClosedInterval(value) ? "17:00" : value.openIntervals[0].end;
  endValue = endValue.length === 4 ? `0${endValue}` : endValue;

  console.log(day, startValue, endValue);

  return (
    <Card>
      <FormItem className="space-y-3">
        <FormLabel className="font-lato-bold text-base">
          {dayOfWeekLabel}
        </FormLabel>
        <FormControl>
          <RadioGroup
            onValueChange={onRadioChange}
            defaultValue={isClosedInterval(value) ? "closed" : "open"}
            className="flex flex-col space-y-1"
          >
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="closed" />
              </FormControl>
              <FormLabel className="font-lato-regular text-gray-700">
                Closed
              </FormLabel>
            </FormItem>
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="open" />
              </FormControl>
              <FormLabel className="font-lato-regular text-gray-700">
                Open
              </FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
        <FormMessage />
        {/* TODO: Make the inputs 24 hr instead of 12 hr */}
        {isClosedInterval(value) ? null : (
          <div className="flex gap-x-2">
            <div>
              <Label className="font-lato-regular text-[13px] text-gray-700 pb-1">
                From
              </Label>
              <Input
                type="time"
                step={60}
                className="font-lato-regular text-base h-8 max-w-[151px]"
                onChange={onStartChange}
                // id={id}
                // placeholder="shadcn"
                // {...field}
                value={startValue}
              />
            </div>
            <div>
              <Label className="font-lato-regular text-[13px] text-gray-700 pb-1">
                To
              </Label>
              <Input
                type="time"
                step={60}
                className="font-lato-regular text-base h-8 max-w-[151px]"
                // id={id}
                // placeholder="shadcn"
                // {...field}
                onChange={onEndChange}
                value={endValue}
              />
            </div>
          </div>
        )}
      </FormItem>
    </Card>
  );
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
        <form
          // onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name={"hours.monday"}
            render={({ field }) =>
              renderHoursFormCard("monday", onValueChange, field.value)
            }
          />
          <FormField
            control={form.control}
            name={"hours.tuesday"}
            render={({ field }) =>
              renderHoursFormCard("tuesday", onValueChange, field.value)
            }
          />
          <FormField
            control={form.control}
            name={"hours.wednesday"}
            render={({ field }) =>
              renderHoursFormCard("wednesday", onValueChange, field.value)
            }
          />
          <FormField
            control={form.control}
            name={"hours.thursday"}
            render={({ field }) =>
              renderHoursFormCard("thursday", onValueChange, field.value)
            }
          />
          <FormField
            control={form.control}
            name={"hours.friday"}
            render={({ field }) =>
              renderHoursFormCard("friday", onValueChange, field.value)
            }
          />
          <FormField
            control={form.control}
            name={"hours.saturday"}
            render={({ field }) =>
              renderHoursFormCard("saturday", onValueChange, field.value)
            }
          />
          <FormField
            control={form.control}
            name={"hours.sunday"}
            render={({ field }) =>
              renderHoursFormCard("sunday", onValueChange, field.value)
            }
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

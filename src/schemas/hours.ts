import { z } from "zod";
import { validateTime } from "../utils/validateTime";

// Schema for TimeInterval
export const TimeIntervalSchema = z
  .object({
    start: z.string().refine((value) => validateTime(value, "start"), {
      message: "Invalid time interval",
    }),
    end: z.string().refine((value) => validateTime(value, "end"), {
      message: "Invalid time interval",
    }),
  })
  .refine((data) => data.start <= data.end, {
    message: "Start time cannot be after the end time",
    path: ["start"],
  });

// Schema for HolidayHour
export const HolidayHourSchema = z.object({
  date: z.string(),
  isClosed: z.optional(z.boolean()),
  openIntervals: z.optional(z.array(TimeIntervalSchema)),
});

// Schema for DayInterval
export const DayIntervalSchema = z
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

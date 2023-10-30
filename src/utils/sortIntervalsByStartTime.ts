import { isClosedInterval } from "../components/form/HoursForm";
import { DayIntervalType, HolidayHourType } from "../types/yext";

export const sortIntervalsByStartTime = (hours?: {
  monday: DayIntervalType;
  tuesday: DayIntervalType;
  wednesday: DayIntervalType;
  thursday: DayIntervalType;
  friday: DayIntervalType;
  saturday: DayIntervalType;
  sunday: DayIntervalType;
  holidayHours: HolidayHourType[];
}): typeof hours => {
  if (!hours) {
    return hours;
  }
  const days: (keyof typeof hours)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  for (let day of days) {
    const dayInterval = hours[day];

    // Added type guard to ensure we're working with a DayIntervalType
    if ("openIntervals" in dayInterval && !isClosedInterval(dayInterval)) {
      dayInterval.openIntervals.sort((a, b) => {
        return a.start.localeCompare(b.start);
      });
    }
  }

  return hours;
};

import { isClosedInterval } from "../components/form/HoursForm";
import { DayIntervalType, HolidayHourType } from "../types/yext";

export const sortIntervalsByStartTime = (hours: {
  monday: DayIntervalType;
  tuesday: DayIntervalType;
  wednesday: DayIntervalType;
  thursday: DayIntervalType;
  friday: DayIntervalType;
  saturday: DayIntervalType;
  sunday: DayIntervalType;
}): typeof hours => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  for (let day of days) {
    const dayInterval = hours[day as keyof typeof hours];

    if (!isClosedInterval(dayInterval) && dayInterval.openIntervals) {
      dayInterval.openIntervals.sort((a, b) => {
        return a.start.localeCompare(b.start);
      });
    }
  }

  return hours;
};

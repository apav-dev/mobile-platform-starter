import * as React from "react";

import { HolidayHour } from "../types/yext";
import { getDayOfWeek } from "../utils/getDayOfWeek";

export interface DayIntervalProps {
  holiday: HolidayHour;
}

const HolidayInterval = ({ holiday }: DayIntervalProps) => {
  console.log(holiday)

  // TODO: Handle multiple intervals
  const open = holiday.openIntervals?.[0]?.start;
  const close = holiday.openIntervals?.[0]?.end;

  const date = `${holiday.date.replace(/-/g, "/")} (${getDayOfWeek(holiday.date)})`;

  return (
    <div className="justify-start items-start gap-4 inline-flex">
      <div className="w-[200px] text-gray-700 text-base font-lato-bold leading-tight">{date}</div>
      <div className="text-gray-700 text-base font-lato-regular leading-tight">{holiday.isClosed ? "Closed" : `${open} to ${close}`}</div>
    </div>
  )
}

export default HolidayInterval;
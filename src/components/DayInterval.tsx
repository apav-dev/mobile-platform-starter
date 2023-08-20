import * as React from "react";

import { DayInterval as DayIntervalType } from "../types/yext";

export interface DayIntervalProps {
  day: string;
  intervals: DayIntervalType;
}

const DayInterval = ({ day, intervals }: DayIntervalProps) => {
  // TODO: Handle multiple intervals
  const closed = intervals.closed;
  const open = intervals.openIntervals?.[0]?.start;
  const close =  intervals.openIntervals?.[0]?.end;

  return (
    <div className="justify-start items-start gap-4 inline-flex">
      <div className="w-[42px] text-gray-700 text-base font-lato-bold leading-tight">{day}</div>
      <div className="text-gray-700 text-base font-lato-regular leading-tight">{closed ? "Closed" : `${open} to ${close}`}</div>
    </div>
  )
}

export default DayInterval;
import * as React from "react";

import { DayIntervalType as DayIntervalType } from "../types/yext";
import { isClosedInterval } from "./form/HoursForm";

export interface DayIntervalProps {
  day: string;
  intervals: DayIntervalType;
}

const DayInterval = ({ day, intervals }: DayIntervalProps) => {
  const closed = isClosedInterval(intervals);

  return (
    <div className="justify-start items-start gap-4 inline-flex">
      <div className="w-[42px] text-gray-700 text-base font-lato-bold leading-tight">
        {day}
      </div>
      {closed ? (
        <div className="text-gray-700 text-base font-lato-regular leading-tight">
          Closed
        </div>
      ) : (
        <div className="flex flex-col">
          {intervals.openIntervals?.map((interval) => (
            <div className="text-gray-700 text-base font-lato-regular leading-tight">
              {`${interval.start} to ${interval.end}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DayInterval;

import * as React from "react";

import { HolidayHourType } from "../types/yext";
import HolidayInterval from "./HolidayInterval";

export interface HolidayHoursProps {
  holidayHours: HolidayHourType[];
}

const HolidayHours = ({ holidayHours }: HolidayHoursProps) => {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-1">
      {holidayHours?.map((hh) => (
        <HolidayInterval holiday={hh} />
      ))}
    </div>
  );
};

export default HolidayHours;

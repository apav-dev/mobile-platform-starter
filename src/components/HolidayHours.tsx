import HolidayInterval from "./HolidayInterval";
import { v4 as uuidv4 } from "uuid";

import { HolidayHourType } from "../types/yext";

export interface HolidayHoursProps {
  holidayHours: HolidayHourType[];
}

export const HolidayHours = ({ holidayHours }: HolidayHoursProps) => {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-1">
      {holidayHours?.map((hh) => (
        <HolidayInterval key={uuidv4()} holiday={hh} />
      ))}
    </div>
  );
};

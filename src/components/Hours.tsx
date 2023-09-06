import * as React from "react";
import { DayInterval } from "./DayInterval";

import {
  DayIntervalType as DayIntervalType,
  HolidayHourType,
} from "../types/yext";

export interface HoursProps {
  hours: {
    monday: DayIntervalType;
    tuesday: DayIntervalType;
    wednesday: DayIntervalType;
    thursday: DayIntervalType;
    friday: DayIntervalType;
    saturday: DayIntervalType;
    sunday: DayIntervalType;
    holidayHours: HolidayHourType[];
  };
}

const Hours = ({ hours }: HoursProps) => {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-1">
      <DayInterval day="Mon" intervals={hours.monday} />
      <DayInterval day="Tue" intervals={hours.tuesday} />
      <DayInterval day="Wed" intervals={hours.wednesday} />
      <DayInterval day="Thu" intervals={hours.thursday} />
      <DayInterval day="Fri" intervals={hours.friday} />
      <DayInterval day="Sat" intervals={hours.saturday} />
      <DayInterval day="Sun" intervals={hours.sunday} />
    </div>
  );
};

export default Hours;

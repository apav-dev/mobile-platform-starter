import * as React from "react";
import DayInterval from "./DayInterval";

import { DayInterval as DayIntervalType, HolidayHour as HolidayHourType } from "../types/yext";
import HolidayInterval from "./HolidayInterval";

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
  renderHolidayHours?: boolean;
}


const Hours = ({ hours, renderHolidayHours}: HoursProps) => {
  return  (
  <div className="self-stretch flex flex-col justify-start items-start gap-1">
    {!renderHolidayHours ? 
    (
      <>    
        <DayInterval day="Mon" intervals={hours.monday} />
        <DayInterval day="Tue" intervals={hours.tuesday} />
        <DayInterval day="Wed" intervals={hours.wednesday} />
        <DayInterval day="Thu" intervals={hours.thursday} />
        <DayInterval day="Fri" intervals={hours.friday} />
        <DayInterval day="Sat" intervals={hours.saturday} />
        <DayInterval day="Sun" intervals={hours.sunday} />
      </>
    ) : 
      <>
      {hours.holidayHours.map(hh => <HolidayInterval holiday={hh} />)}
      </>
    }
  </div>);
}

export default Hours;
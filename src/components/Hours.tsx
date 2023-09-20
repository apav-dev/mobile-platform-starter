import * as React from "react";
import { DayInterval } from "./DayInterval";

import {
  DayIntervalType as DayIntervalType,
  HolidayHourType,
} from "../types/yext";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-1">
      <DayInterval day={t("Mon")} intervals={hours.monday} />
      <DayInterval day={t("Tue")} intervals={hours.tuesday} />
      <DayInterval day={t("Wed")} intervals={hours.wednesday} />
      <DayInterval day={t("Thu")} intervals={hours.thursday} />
      <DayInterval day={t("Fri")} intervals={hours.friday} />
      <DayInterval day={t("Sat")} intervals={hours.saturday} />
      <DayInterval day={t("Sun")} intervals={hours.sunday} />
    </div>
  );
};

export default Hours;

import { v4 as uuidv4 } from "uuid";
import { DayIntervalType as DayIntervalType } from "../types/yext";
import { isClosedInterval } from "./form/HoursForm";
import { formatTime } from "../utils/formatTime";
import { useTranslation } from "react-i18next";

export interface DayIntervalProps {
  day: string;
  intervals: DayIntervalType;
}

export const DayInterval = ({ day, intervals }: DayIntervalProps) => {
  const closed = isClosedInterval(intervals);
  const { t } = useTranslation();

  return (
    <div className="justify-start items-start gap-4 inline-flex">
      <div className="text-gray-700 text-base font-lato-bold leading-tight">
        {day}
      </div>
      {closed ? (
        <div className="text-gray-700 text-base font-lato-regular leading-tight">
          {t("Closed")}
        </div>
      ) : (
        <div className="flex flex-col">
          {intervals.openIntervals?.map((interval) => (
            <div
              key={uuidv4()}
              className="text-gray-700 text-base font-lato-regular leading-tight"
            >
              {`${formatTime(interval.start)} ${t("To")} ${formatTime(
                interval.end
              )}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

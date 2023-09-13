import { formatTime } from "../utils/formatTime";
import { HolidayHourType } from "../types/yext";
import { getDayOfWeek } from "../utils/getDayOfWeek";

export interface DayIntervalProps {
  holiday: HolidayHourType;
}

const HolidayInterval = ({ holiday }: DayIntervalProps) => {
  const date = `${holiday.date.replace(/-/g, "/")} (${getDayOfWeek(
    holiday.date
  )})`;

  return (
    <div className="justify-start items-start gap-4 inline-flex">
      <div className="w-40 text-gray-700 text-base font-lato-bold leading-tight">
        {date}
      </div>
      <div className="text-gray-700 text-base font-lato-regular leading-tight">
        {holiday.isClosed ? (
          "Closed"
        ) : (
          <>
            {holiday.openIntervals?.map((interval) => (
              <div
                key={`${date}-${interval.start}`}
                className="text-gray-700 text-base font-lato-regular leading-tight"
              >
                {`${formatTime(interval.start)} to ${formatTime(interval.end)}`}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default HolidayInterval;

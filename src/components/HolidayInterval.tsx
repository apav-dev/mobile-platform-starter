import { formatTime } from "../utils/formatTime";
import { HolidayHourType } from "../types/yext";
import { useTranslation } from "react-i18next";

export interface DayIntervalProps {
  holiday: HolidayHourType;
}

const HolidayInterval = ({ holiday }: DayIntervalProps) => {
  const { t } = useTranslation();

  const date = new Date(holiday.date + "Z"); // Ensure we parse as UTC
  const formattedDate = date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
  const dayOfWeek = date.toLocaleDateString(undefined, {
    weekday: "short",
    timeZone: "UTC", // Also add timeZone here to be consistent
  });
  const finalDate = `${formattedDate} (${t(dayOfWeek)})`;

  return (
    <div className="justify-start items-start gap-4 inline-flex">
      <div className="w-40 text-gray-700 text-base font-lato-bold leading-tight">
        {finalDate}
      </div>
      <div className="text-gray-700 text-base font-lato-regular leading-tight">
        {holiday.isClosed ? (
          t("Closed")
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

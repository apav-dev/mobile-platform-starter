import { formatTime } from "../utils/formatTime";
import { HolidayHourType } from "../types/yext";
import { getDayOfWeek } from "../utils/getDayOfWeek";
import { useTranslation } from "react-i18next";

export interface DayIntervalProps {
  holiday: HolidayHourType;
}

const HolidayInterval = ({ holiday }: DayIntervalProps) => {
  const { t } = useTranslation();

  const date = new Date(holiday.date);
  const formattedDate = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const dayOfWeek = date.toLocaleDateString(undefined, {
    weekday: "short",
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

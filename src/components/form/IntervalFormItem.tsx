import * as React from "react";
import { DayOfWeek, isClosedInterval } from "./HoursForm";
import { Card } from "../Card";
import { FormLabel, FormMessage } from "./Form";
import { RadioGroup, RadioGroupItem } from "../Radio";
import { Label } from "../Label";
import { Input } from "../Input";
import { TrashIcon } from "../icons/TrashIcon";
import { v4 as uuidv4 } from "uuid";

import { DayIntervalType } from "../../types/yext";
import { useTranslation } from "react-i18next";

export interface IntervalFormCardProps {
  day: DayOfWeek;
  onValueChange: (
    dayOfWeek: DayOfWeek,
    interval: DayIntervalType,
    changeToOpen?: boolean
  ) => void;
  value: DayIntervalType;
}

export const IntervalFormItem = ({
  day,
  onValueChange,
  value,
}: IntervalFormCardProps) => {
  const { t } = useTranslation();
  const onRadioChange = (radioValue: string) => {
    if (radioValue === "closed") {
      onValueChange(day, { isClosed: true });
    } else {
      onValueChange(
        day,
        {
          openIntervals: [
            {
              start: "",
              end: "",
            },
          ],
        },
        true
      );
    }
  };

  const handleStartChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!isClosedInterval(value)) {
      const newStart = e.target.value;
      const intervals = value.openIntervals.map((interval, i) => {
        if (i === index) {
          return {
            start: newStart,
            end: interval.end,
          };
        }
        return interval;
      });
      onValueChange(day, {
        openIntervals: intervals,
      });
    }
  };

  const handleEndChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!isClosedInterval(value)) {
      const newEnd = e.target.value;
      const intervals = value.openIntervals.map((interval, i) => {
        if (i === index) {
          return {
            start: interval.start,
            end: newEnd,
          };
        }
        return interval;
      });
      onValueChange(day, {
        openIntervals: intervals,
      });
    }
  };

  const handleAddInterval = () => {
    if (!isClosedInterval(value)) {
      onValueChange(day, {
        openIntervals: [
          ...value.openIntervals,
          {
            start: "",
            end: "",
          },
        ],
      });
    }
  };

  const handleRemoveLastInterval = () => {
    if (!isClosedInterval(value)) {
      const intervals = value.openIntervals.slice(0, -1);
      onValueChange(day, {
        openIntervals: intervals,
      });
    }
  };

  const dayOfWeekLabel = day.charAt(0).toUpperCase() + day.slice(1);

  return (
    <Card>
      <div className="space-y-3">
        <FormLabel className="font-lato-bold text-base">
          {t(dayOfWeekLabel)}
        </FormLabel>
        <RadioGroup
          onValueChange={onRadioChange}
          defaultValue={isClosedInterval(value) ? "closed" : "open"}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="closed" />
            <FormLabel className="font-lato-regular text-gray-700">
              {t("Closed")}
            </FormLabel>
          </div>
          <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="open" />
            <FormLabel className="font-lato-regular text-gray-700">
              {t("Open")}
            </FormLabel>
          </div>
        </RadioGroup>
        {/* TODO: Make the inputs 24 hr instead of 12 hr */}
        {isClosedInterval(value) ? null : (
          <>
            {value.openIntervals.map((interval, index) => {
              return (
                <div
                  key={uuidv4()}
                  className="gap-3 flex flex-col xs:flex-row xs:gap-2"
                >
                  <div className="flex flex-col flex-1">
                    <Label className="font-lato-regular text-[13px] text-gray-700 pb-1">
                      {t("From")}
                    </Label>
                    <Input
                      id={`${day}-start`}
                      type="time"
                      step={60}
                      className="font-lato-regular text-[13px] h-8 text-gray-500"
                      onChange={(e) => handleStartChange(e, index)}
                      value={interval.start}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <Label className="font-lato-regular text-[13px] text-gray-700 pb-1">
                      {t("To")}
                    </Label>
                    <Input
                      id={`${day}-end`}
                      type="time"
                      step={60}
                      className="font-lato-regular text-[13px] h-8 text-gray-500"
                      onChange={(e) => handleEndChange(e, index)}
                      value={interval.end}
                    />
                  </div>
                  {value.openIntervals.length > 1 &&
                  index === value.openIntervals.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleRemoveLastInterval}
                      className="flex items-end pb-2"
                    >
                      <TrashIcon />
                    </button>
                  ) : (
                    <div className="w-3" />
                  )}
                </div>
              );
            })}
            <FormMessage />
            <div className="items-center flex">
              <button
                type="button"
                className="text-blue text-base font-lato-regular hover:underline"
                onClick={handleAddInterval}
              >
                {`+ ${t("Add Interval")}`}
              </button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

import * as React from "react";
import { DayOfWeek, isClosedInterval } from "./HoursForm";
import Card from "../Card";
import { FormControl, FormItem, FormLabel, FormMessage } from "./Form";
import { RadioGroup, RadioGroupItem } from "../Radio";
import { Label } from "../Label";
import { Input } from "../Input";

export interface IntervalFormCardProps {
  day: DayOfWeek;
  onValueChange: (
    dayOfWeek: DayOfWeek,
    interval:
      | {
          openIntervals: {
            start: string;
            end: string;
          }[];
        }
      | {
          isClosed: boolean;
        }
  ) => void;
  value: (
    | { openIntervals: { start: string; end: string }[] }
    | { isClosed: boolean }
  ) &
    (
      | { openIntervals: { start: string; end: string }[] }
      | { isClosed: boolean }
      | undefined
    );
}

const IntervalFormItem = ({
  day,
  onValueChange,
  value,
}: IntervalFormCardProps) => {
  const onRadioChange = (value: string) => {
    if (value === "closed") {
      onValueChange(day, { isClosed: true });
    } else {
      onValueChange(day, {
        openIntervals: [
          {
            start: "9:00",
            end: "5:00",
          },
        ],
      });
    }
  };

  const onStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(day, {
      openIntervals: [
        {
          start: e.target.value,
          end: value.openIntervals[0].end,
        },
      ],
    });
  };

  const onEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(day, {
      openIntervals: [
        {
          start: value.openIntervals[0].start,
          end: e.target.value,
        },
      ],
    });
  };

  const dayOfWeekLabel = day.charAt(0).toUpperCase() + day.slice(1);

  let startValue = isClosedInterval(value)
    ? "09:00"
    : value.openIntervals[0].start;
  startValue = startValue.length === 4 ? `0${startValue}` : startValue;

  let endValue = isClosedInterval(value) ? "17:00" : value.openIntervals[0].end;
  endValue = endValue.length === 4 ? `0${endValue}` : endValue;

  return (
    <Card>
      <FormItem className="space-y-3">
        <FormLabel className="font-lato-bold text-base">
          {dayOfWeekLabel}
        </FormLabel>
        <FormControl>
          <RadioGroup
            onValueChange={onRadioChange}
            defaultValue={isClosedInterval(value) ? "closed" : "open"}
            className="flex flex-col space-y-1"
          >
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="closed" />
              </FormControl>
              <FormLabel className="font-lato-regular text-gray-700">
                Closed
              </FormLabel>
            </FormItem>
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="open" />
              </FormControl>
              <FormLabel className="font-lato-regular text-gray-700">
                Open
              </FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
        <FormMessage />
        {/* TODO: Make the inputs 24 hr instead of 12 hr */}
        {isClosedInterval(value) ? null : (
          <div className="flex gap-x-2">
            <div>
              <Label className="font-lato-regular text-[13px] text-gray-700 pb-1">
                From
              </Label>
              <Input
                type="time"
                step={60}
                className="font-lato-regular text-base h-8 max-w-[151px]"
                onChange={onStartChange}
                // id={id}
                // placeholder="shadcn"
                // {...field}
                value={startValue}
              />
            </div>
            <div>
              <Label className="font-lato-regular text-[13px] text-gray-700 pb-1">
                To
              </Label>
              <Input
                type="time"
                step={60}
                className="font-lato-regular text-base h-8 max-w-[151px]"
                // id={id}
                // placeholder="shadcn"
                // {...field}
                onChange={onEndChange}
                value={endValue}
              />
            </div>
          </div>
        )}
      </FormItem>
    </Card>
  );
};

export default IntervalFormItem;

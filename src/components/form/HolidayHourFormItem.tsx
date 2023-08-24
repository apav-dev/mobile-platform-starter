import * as React from "react";
import Card from "../Card";
import { FormControl, FormItem, FormLabel, FormMessage } from "./Form";
import { RadioGroup, RadioGroupItem } from "../Radio";
import { Label } from "../Label";
import { Input } from "../Input";
import { HolidayHourType } from "@/src/types/yext";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { Button } from "../Button";
import { cn } from "../../utils/cn";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../Calendar";
import { format } from "date-fns";
import { TrashIcon } from "../icons/TrashIcon";

export interface IntervalFormCardProps {
  label: string;
  index: number;
  onValueChange: (index: number, value: HolidayHourType) => void;
  holidayHourValue?: HolidayHourType;
  onDelete?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => void;
}

const HolidayHourFormItem = ({
  label,
  index,
  onValueChange,
  holidayHourValue,
  onDelete,
}: IntervalFormCardProps) => {
  if (!holidayHourValue) return null;

  let startValue = holidayHourValue.openIntervals?.[0]
    ? holidayHourValue.openIntervals?.[0].start
    : "";
  startValue = startValue.length == 3 ? `0${startValue}` : startValue;

  let endValue = holidayHourValue.openIntervals?.[0]
    ? holidayHourValue.openIntervals?.[0].end
    : "";
  endValue = endValue.length == 3 ? `0${endValue}` : endValue;

  const onRadioChange = (value: string) => {
    if (value === "closed") {
      onValueChange(index, {
        isClosed: true,
        date: holidayHourValue.date,
      });
    } else {
      onValueChange(index, {
        isClosed: false,
        date: holidayHourValue.date,
        openIntervals: [
          {
            start: startValue,
            end: endValue,
          },
        ],
      });
    }
  };

  const onDateChange = (date: Date | undefined) => {
    const dateStr = date?.toISOString().split("T")[0];
    onValueChange(index, {
      date: dateStr || "",
      isClosed: holidayHourValue.isClosed,
      openIntervals: holidayHourValue.openIntervals,
    });
  };

  const onStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(index, {
      ...holidayHourValue,
      openIntervals: [
        {
          start: e.target.value,
          end: endValue,
        },
      ],
    });
  };

  const onEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(index, {
      ...holidayHourValue,
      openIntervals: [
        {
          start: startValue,
          end: e.target.value,
        },
      ],
    });
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onDelete?.(e, index);
  };

  const [year, month, day] = holidayHourValue.date.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return (
    <Card>
      <FormItem className="space-y-3">
        <div className="flex justify-between">
          <FormLabel className="font-lato-bold text-base">{label}</FormLabel>
          <button type="button" onClick={handleDelete}>
            <TrashIcon />
          </button>
        </div>
        <FormControl>
          <RadioGroup
            onValueChange={onRadioChange}
            defaultValue={holidayHourValue.isClosed ? "closed" : "open"}
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
        <div className="flex flex-col">
          <Label className="font-lato-regular text-[13px] text-gray-700 pb-1">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-lato-regular text-gray-500",
                    !localDate && "text-muted-foreground"
                  )}
                >
                  {localDate ? (
                    format(localDate, "MM/dd/yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                className="bg-white font-lato-regular"
                mode="single"
                // new date from string of form yyyy-mm-dd
                selected={localDate}
                onSelect={onDateChange}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {holidayHourValue.isClosed ? null : (
          <div className="gap-3 flex flex-col xs:flex-row xs:gap-2">
            <div className="flex flex-col flex-1">
              <Label className="font-lato-regular text-[13px] text-gray-700 pb-1">
                From
              </Label>
              <Input
                type="time"
                // step={60}
                className="font-lato-regular text-[13px] text-gray-500  h-8"
                onChange={onStartChange}
                // id={id}
                // placeholder="shadcn"
                // {...field}
                value={startValue}
              />
            </div>
            <div className="flex flex-col flex-1">
              <Label className="font-lato-regular text-[13px] text-gray-700 pb-1">
                To
              </Label>
              <Input
                type="time"
                step={60}
                className="font-lato-regular text-[13px] h-8 text-gray-500"
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

export default HolidayHourFormItem;

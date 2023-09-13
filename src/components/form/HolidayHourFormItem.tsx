import { Card } from "../Card";
import { FormLabel, FormMessage } from "./Form";
import { RadioGroup, RadioGroupItem } from "../Radio";
import { Label } from "../Label";
import { Input } from "../Input";
import { HolidayHourType } from "../../types/yext";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { Button } from "../Button";
import { cn } from "../../utils/cn";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../Calendar";
import { format } from "date-fns";
import { TrashIcon } from "../icons/TrashIcon";
import { v4 as uuidv4 } from "uuid";

export interface IntervalFormCardProps {
  label: string;
  hourIndex: number;
  onValueChange: (index: number, value: HolidayHourType) => void;
  value?: HolidayHourType;
  onDelete?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => void;
}

export const HolidayHourFormItem = ({
  label,
  hourIndex,
  onValueChange,
  value,
  onDelete,
}: IntervalFormCardProps) => {
  if (!value) return null;

  const onRadioChange = (radioValue: string) => {
    if (radioValue === "closed") {
      onValueChange(hourIndex, {
        isClosed: true,
        date: value.date,
      });
    } else {
      onValueChange(hourIndex, {
        isClosed: false,
        date: value.date,
        openIntervals: [
          {
            start: "",
            end: "",
          },
        ],
      });
    }
  };

  const onDateChange = (date: Date | undefined) => {
    const dateStr = date?.toISOString().split("T")[0];
    onValueChange(hourIndex, {
      date: dateStr || "",
      isClosed: value.isClosed,
      openIntervals: value.openIntervals,
    });
  };

  const handleStartChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    intervalIndex: number
  ) => {
    if (!value.isClosed) {
      const newStart = e.target.value;
      const intervals = value.openIntervals?.map((interval, i) => {
        if (i === intervalIndex) {
          return {
            start: newStart,
            end: interval.end,
          };
        }
        return interval;
      });

      onValueChange(hourIndex, {
        ...value,
        openIntervals: intervals,
      });
    }
  };

  const handleEndChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    intervalIndex: number
  ) => {
    if (!value.isClosed) {
      const newEnd = e.target.value;
      const intervals = value.openIntervals?.map((interval, i) => {
        if (i === intervalIndex) {
          return {
            start: interval.start,
            end: newEnd,
          };
        }
        return interval;
      });

      onValueChange(hourIndex, {
        ...value,
        openIntervals: intervals,
      });
    }
  };

  const handleAddInterval = () => {
    if (!value.isClosed) {
      onValueChange(hourIndex, {
        ...value,
        openIntervals: [
          ...(value.openIntervals ?? []),
          {
            start: "",
            end: "",
          },
        ],
      });
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onDelete?.(e, hourIndex);
  };

  const handleRemoveLastInterval = () => {
    if (!value.isClosed) {
      onValueChange(hourIndex, {
        ...value,
        openIntervals: value.openIntervals?.slice(0, -1),
      });
    }
  };

  const [year, month, day] = value.date.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex justify-between">
          <FormLabel className="font-lato-bold text-base">{label}</FormLabel>
          <button type="button" onClick={handleDelete}>
            <TrashIcon />
          </button>
        </div>
        <RadioGroup
          onValueChange={onRadioChange}
          defaultValue={value.isClosed ? "closed" : "open"}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="closed" />
            <FormLabel className="font-lato-regular text-gray-700">
              Closed
            </FormLabel>
          </div>
          <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="open" />
            <FormLabel className="font-lato-regular text-gray-700">
              Open
            </FormLabel>
          </div>
        </RadioGroup>
        <div className="flex flex-col">
          <Label className="font-lato-regular text-[13px] text-gray-700 pb-1">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
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
        {value.isClosed ? null : (
          <>
            {value.openIntervals?.map((interval, intervalIndex) => (
              <div key={uuidv4()} className="flex flex-col gap-y-3">
                <div className="gap-3 flex flex-col xs:flex-row xs:gap-2">
                  <div className="flex flex-col flex-1">
                    <Label className="font-lato-regular text-[13px] text-gray-700 pb-1">
                      From
                    </Label>
                    <Input
                      type="time"
                      step={60}
                      className="font-lato-regular text-[13px] text-gray-500  h-8"
                      onChange={(e) => handleStartChange(e, intervalIndex)}
                      value={interval.start}
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
                      onChange={(e) => handleEndChange(e, intervalIndex)}
                      value={interval.end}
                    />
                  </div>
                  {value.openIntervals &&
                  value.openIntervals?.length > 1 &&
                  intervalIndex === value.openIntervals.length - 1 ? (
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
              </div>
            ))}
            <FormMessage />
            <div className="items-center flex">
              <button
                type="button"
                className="text-blue text-base font-lato-regular hover:underline"
                onClick={handleAddInterval}
              >
                + Add Interval
              </button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

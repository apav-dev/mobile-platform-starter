import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../utils/cn";

const calculateTicks = (min: number, max: number, step: number): number[] => {
  const ticks: number[] = [];
  for (let i = min; i <= max; i += step) {
    ticks.push(i);
  }
  return ticks;
};

const defaultMin = 0;
const defaultMax = 100;
const defaultStep = 1;

type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> & {
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, min, max, step, value, onChange, ...props }, ref) => {
  const ticks = calculateTicks(
    min ?? defaultMin,
    max ?? defaultMax,
    step ?? defaultStep
  );

  return (
    <SliderPrimitive.Root
      value={value ?? [min ?? defaultMin, max ?? defaultMax]}
      onValueChange={(minMax) => {
        onChange?.([minMax[0], minMax[1]]);
      }}
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center my-6",
        className
      )}
      min={min ?? defaultMin}
      max={max ?? defaultMax}
      step={step ?? defaultStep}
      {...props}
    >
      {ticks.map((tick, index) => (
        <div
          className="absolute"
          style={{
            left: `${
              ((tick - (min ?? defaultMin)) /
                ((max ?? defaultMax) - (min ?? defaultMin))) *
              100
            }%`,
            transform: "translateX(-50%)", // to center the star above the tick
            bottom: "calc(100% + 5px)", // position the star above the track, adjust as needed
          }}
        >
          {/* loop over array of length index + 1 and render a star*/}
          <div
            className={cn(
              "flex",
              index === 0 && "ml-4",
              index === (max ?? defaultMax) - 1 && "mr-4"
            )}
          >
            <span className="text-gray-700 font-lato-regular text-xs">
              {index + 1}
            </span>
          </div>
        </div>
      ))}
      <SliderPrimitive.Track className="relative my-2 h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        {ticks.map((tick, index) => (
          <div
            key={`slider-tick-${index}`}
            className="absolute top-0 h-2 w-px bg-gray-400"
            style={{
              left: `${
                ((tick - (min ?? defaultMin)) /
                  ((max ?? defaultMax) - (min ?? defaultMin))) *
                100
              }%`,
            }}
          ></div>
        ))}
        <SliderPrimitive.Range className="absolute h-full bg-gray-700" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-gray-700 bg-gray-700 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-gray-700 bg-gray-700 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

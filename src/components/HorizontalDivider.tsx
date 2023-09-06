import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface HorizontalDividerProps {
  className?: string;
}

export const HorizontalDivider = ({ className }: HorizontalDividerProps) => {
  return (
    <div className={twMerge(`h-0 border border-neutral-300`, className)}></div>
  );
};

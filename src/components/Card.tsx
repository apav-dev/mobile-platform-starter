import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps {
  children?: React.ReactNode;
  containerClassName?: string;
}

const Card = ({ children, containerClassName }: CardProps) => {
  return (
    <div
      className={twMerge(
        "p-4 bg-white rounded-lg shadow border border-zinc-200",
        containerClassName
      )}
    >
      {children}
    </div>
  );
};

export default Card;

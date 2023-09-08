import * as React from "react";
import { cn } from "../utils/cn";

export default function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-gray-300 rounded-md", className)}
      {...props}
    />
  );
}

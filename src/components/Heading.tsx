import * as React from "react";
import Skeleton from "./Skeleton";

export interface HeadingProps {
  icon?: React.ReactNode;
  title: string;
}

export const HeadingSkeleton = () => {
  return (
    <div className="justify-start items-center gap-2 inline-flex">
      <Skeleton className="w-5 h-5" />
      <Skeleton className="w-20 h-5 " />
    </div>
  );
};

export const Heading = ({ icon, title }: HeadingProps) => {
  return (
    <div className="justify-start items-center gap-2 inline-flex">
      {icon}
      <div className="text-gray-700 text-2xl font-bold font-lato-bold">
        {title}
      </div>
    </div>
  );
};

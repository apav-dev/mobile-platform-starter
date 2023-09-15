import * as React from "react";
import { Card } from "../Card";
import Skeleton from "../Skeleton";

export interface AnalyticsMetricCardProps {
  icon: React.ReactNode;
  label: string;
  metric: number | string | null | undefined;
}

export const AnalyticsCardSkeleton = () => {
  return (
    <Card containerClassName="flex flex-col gap-y-4">
      <div className="justify-between items-center gap-4 inline-flex">
        <div className="flex gap-x-4 items-center">
          <Skeleton className="rounded-full h-10 w-10" />
          <div className="flex-col gap-y-2 justify-center items-start inline-flex">
            <Skeleton className="w-36 h-4" />
            <Skeleton className="w-20 h-8" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export const AnalyticsMetricCard = ({
  metric,
  icon,
  label,
}: AnalyticsMetricCardProps) => {
  return (
    <Card containerClassName="flex gap-4 items-center">
      <div className="bg-gray-300 rounded-full h-10 w-10 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-lato-regular text-sm text-gray-600">{label}</h3>
        <span className="font-lato-bold text-3xl text-gray-700">
          {metric || 0}
        </span>
      </div>
    </Card>
  );
};

import * as React from "react";
import { Card } from "../Card";
import { useEffect } from "react";
import { usePageContext } from "../utils/usePageContext";
import {
  DayIntervalType,
  HolidayHourType as HolidayHourType,
} from "../../types/yext";
import { ContentContainer } from "../ContentContainer";
import { HolidayHoursForm } from "../form/HolidayHoursForm";
import EditPanel from "../EditPanel";
import { HolidayHours } from "../HolidayHours";
import { LocationPinIcon } from "../icons/LocationPinIcon";
import { Heading } from "../Heading";
import Header from "../Header";
import Skeleton from "../Skeleton";
import { useTranslation } from "react-i18next";

export interface HoursCardProps {
  title: string;
  fieldId: string;
  hours: {
    monday: DayIntervalType;
    tuesday: DayIntervalType;
    wednesday: DayIntervalType;
    thursday: DayIntervalType;
    friday: DayIntervalType;
    saturday: DayIntervalType;
    sunday: DayIntervalType;
    holidayHours?: HolidayHourType[];
  };
}

export const HoildayHoursCardSkeleton = () => {
  return (
    <Card containerClassName="flex flex-col gap-y-4">
      <Skeleton className="w-20 h-3" />
      <div className="flex flex-col gap-y-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="flex">
            <Skeleton className="w-20 h-3 mr-20" />
            <Skeleton className="w-20 h-3" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export const HolidayHoursCard = ({ title, fieldId, hours }: HoursCardProps) => {
  if (!hours.holidayHours) {
    return null;
  }

  const { formData, entityMeta, setEditId, editId } = usePageContext();
  const { t } = useTranslation();

  useEffect(() => {
    if (formData[fieldId]) {
      setEditId?.("");
    }
  }, [formData, fieldId]);

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    setEditId?.("");
  };

  const { holidayHours } = hours;

  return (
    // TODO: Is it bad to have onClick without button?
    <div onClick={() => setEditId?.(fieldId)}>
      <Card>
        <div className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2">
          {title}
        </div>
        <HolidayHours holidayHours={holidayHours} />
      </Card>
      <EditPanel open={editId === fieldId}>
        <Header
          breadcrumbs={[
            {
              name: t("Home"),
              path: "/",
            },
            { name: entityMeta?.name ?? "", onClick: handleCancel },
            { name: `${t("Edit")} ${title}` },
          ]}
        />
        <ContentContainer containerClassName="pt-4 pb-20">
          <Heading title={entityMeta?.name ?? ""} icon={<LocationPinIcon />} />
          <div className="pt-4">
            <HolidayHoursForm
              id="hours"
              label={t("Holiday Hours")}
              initialHolidayHours={hours}
              onCancel={handleCancel}
            />
          </div>
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

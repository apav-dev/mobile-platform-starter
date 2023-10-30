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
  // arbitrary ID for the card
  id: string;
  // The field ID for the hours field
  hoursFieldId: string;
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

export const HolidayHoursCard = ({
  title,
  id,
  hours,
  hoursFieldId,
}: HoursCardProps) => {
  const { formData, entityMeta, setEditId, editId } = usePageContext();
  const { t } = useTranslation();

  useEffect(() => {
    if (formData[id]) {
      setEditId?.("");
    }
  }, [formData, id]);

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    setEditId?.("");
  };

  const { holidayHours } = hours ?? { holidayHours: [] };

  return (
    <div onClick={() => setEditId?.(id)}>
      <Card>
        <div className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2">
          {title}
        </div>
        {!holidayHours || holidayHours.length === 0 ? (
          <div className="px-4 py-3 bg-zinc-200 rounded-[3px] justify-center items-center gap-2 flex w-full font-lato-regular">
            {t("addField", { field: t(title) })}
          </div>
        ) : (
          <HolidayHours holidayHours={holidayHours} />
        )}
      </Card>
      <EditPanel open={editId === id}>
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
              id={hoursFieldId}
              label={t(title)}
              initialHolidayHours={hours ?? { holidayHours: [] }}
              onCancel={handleCancel}
            />
          </div>
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

import { Card } from "../Card";
import { useEffect } from "react";
import { usePageContext } from "../utils/usePageContext";
import Hours from "../Hours";
import { ContentContainer } from "../ContentContainer";
import HoursForm from "../form/HoursForm";
import EditPanel from "../EditPanel";
import {
  DayIntervalType as DayIntervalType,
  HolidayHourType,
} from "../../types/yext";
import { sortIntervalsByStartTime } from "../../utils/sortIntervalsByStartTime";
import Header from "../Header";
import { LocationPinIcon } from "../icons/LocationPinIcon";
import { Heading } from "../Heading";
import Skeleton from "../Skeleton";
import { useTranslation } from "react-i18next";

export interface HoursCardProps {
  title: string;
  fieldId: string;
  hours?: {
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

export const HoursCardSkeleton = () => {
  return (
    <Card containerClassName="flex flex-col gap-y-4">
      <Skeleton className="w-20 h-3" />
      <div className="flex flex-col gap-y-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div className="flex gap-x-4" key={i}>
            <Skeleton className="w-10 h-3" />
            <Skeleton className="w-14 h-3" />
          </div>
        ))}
      </div>
    </Card>
  );
};

const hoursPlaceholder = {
  monday: {
    openIntervals: [
      {
        start: "--:--",
        end: "--:--",
      },
    ],
  },
  tuesday: {
    openIntervals: [
      {
        start: "--:--",
        end: "--:--",
      },
    ],
  },
  wednesday: {
    openIntervals: [
      {
        start: "--:--",
        end: "--:--",
      },
    ],
  },
  thursday: {
    openIntervals: [
      {
        start: "--:--",
        end: "--:--",
      },
    ],
  },
  friday: {
    openIntervals: [
      {
        start: "--:--",
        end: "--:--",
      },
    ],
  },
  saturday: {
    openIntervals: [
      {
        start: "--:--",
        end: "--:--",
      },
    ],
  },
  sunday: {
    openIntervals: [
      {
        start: "--:--",
        end: "--:--",
      },
    ],
  },
  holidayHours: [],
};

export const HoursCard = ({ title, fieldId, hours }: HoursCardProps) => {
  const { formData, entityMeta, setEditId, editId } = usePageContext();
  const { t } = useTranslation();

  useEffect(() => {
    if (formData[fieldId]) {
      setEditId?.("");
    }
  }, [formData, fieldId]);

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setEditId?.("");
  };

  const sortedHours = sortIntervalsByStartTime(hours);

  return (
    <div onClick={() => setEditId?.(fieldId)}>
      <Card>
        <div className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2">
          {title}
        </div>
        {!hours ? (
          <div className="px-4 py-3 bg-zinc-200 rounded-[3px] justify-center items-center gap-2 flex w-full font-lato-regular">
            {t("addField", { field: t(title) })}
          </div>
        ) : (
          <Hours hours={sortedHours} />
        )}
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
            <HoursForm
              id={fieldId}
              label={t(title)}
              initialHours={sortedHours ?? hoursPlaceholder}
              onCancel={handleCancel}
            />
          </div>
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

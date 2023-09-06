import * as React from "react";
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

export const HoursCard = ({ title, fieldId, hours }: HoursCardProps) => {
  const { formData, entityMeta, setEditId, editId } = usePageContext();

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
    // TODO: Is it bad to have onClick without button?
    <div onClick={() => setEditId?.(fieldId)}>
      <Card>
        <div className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2">
          {title}
        </div>
        <Hours hours={sortedHours} />
      </Card>
      <EditPanel open={editId === fieldId}>
        <Header
          breadcrumbs={[
            {
              name: "Home",
              path: "/",
            },
            { name: entityMeta?.name ?? "", onClick: handleCancel },
            { name: `Edit ${title}` },
          ]}
        />
        <ContentContainer containerClassName="pt-4 pb-20">
          <Heading title={entityMeta?.name ?? ""} icon={<LocationPinIcon />} />
          <div className="pt-4">
            <HoursForm
              id="hours"
              label="Hours"
              initialHours={sortedHours}
              onCancel={handleCancel}
            />
          </div>
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

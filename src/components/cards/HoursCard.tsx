import * as React from "react";
import Card from "../Card";
import { useEffect, useState } from "react";
import { useEntity } from "../utils/useEntityContext";
import Hours from "../Hours";
import ContentContainer from "../ContentContainer";
import HoursForm from "../form/HoursForm";
import EditPanel from "../EditPanel";

import {
  DayIntervalType as DayIntervalType,
  HolidayHourType,
} from "../../types/yext";
import { sortIntervalsByStartTime } from "../../utils/sortIntervalsByStartTime";

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

const HoursCard = ({ title, fieldId, hours }: HoursCardProps) => {
  const [editMode, setEditMode] = useState(false);

  const { formData } = useEntity();

  useEffect(() => {
    if (formData[fieldId]) {
      setEditMode(false);
    }
  }, [formData, fieldId]);

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditMode(false);
  };

  const sortedHours = sortIntervalsByStartTime(hours);

  return (
    // TODO: Is it bad to have onClick without button?
    <div onClick={() => setEditMode(true)}>
      <Card>
        <div className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2">
          {title}
        </div>
        <Hours hours={sortedHours} />
      </Card>
      <EditPanel open={editMode}>
        <ContentContainer containerClassName="pt-4 pb-20">
          <HoursForm
            id="hours"
            label="Hours"
            initialHours={sortedHours}
            onCancel={handleCancel}
          />
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

export default HoursCard;

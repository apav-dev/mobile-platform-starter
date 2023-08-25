import * as React from "react";
import Card from "../Card";
import { useEffect, useState } from "react";
import { useEntity } from "../utils/useEntityContext";

import {
  DayIntervalType,
  HolidayHourType as HolidayHourType,
} from "@/src/types/yext";
import ContentContainer from "../ContentContainer";
import HolidayHoursForm from "../form/HolidayHoursForm";
import EditPanel from "../EditPanel";
import HolidayHours from "../HolidayHours";

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
    holidayHours: HolidayHourType[];
  };
}

const HolidayHoursCard = ({ title, fieldId, hours }: HoursCardProps) => {
  const [editMode, setEditMode] = useState(false);

  const { formData } = useEntity();

  useEffect(() => {
    if (formData[fieldId]) {
      setEditMode(false);
    }
  }, [formData, fieldId]);

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setEditMode(false);
  };

  const { holidayHours } = hours;

  return (
    // TODO: Is it bad to have onClick without button?
    <div onClick={() => setEditMode(true)}>
      <Card>
        <div className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2">
          {title}
        </div>
        <HolidayHours holidayHours={holidayHours} />
      </Card>
      <EditPanel open={editMode}>
        <ContentContainer containerClassName="pt-4 pb-20">
          <HolidayHoursForm
            id="hours"
            label="Holiday Hours"
            initialHolidayHours={hours}
            onCancel={handleCancel}
          />
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

export default HolidayHoursCard;

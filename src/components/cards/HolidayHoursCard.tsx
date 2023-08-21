import * as React from "react";
import Card from "../Card";
import { useEffect, useState } from "react";
import { useEntity } from "../utils/useEntityContext";
import Hours from "../Hours";

import {
  DayInterval as DayIntervalType,
  HolidayHour as HolidayHourType,
} from "@/src/types/yext";

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
    e.stopPropagation();
    setEditMode(false);
  };

  return (
    // TODO: Is it bad to have onClick without button?
    <div
    // onClick={() => setEditMode(true)}
    >
      <Card>
        <div className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2">
          {title}
        </div>
        <Hours hours={hours} renderHolidayHours />
      </Card>
      {/* <motion.div
        initial={false}
        animate={{ y: editMode ? 0 : "100%" }}
        className="inset-0 absolute bg-white -mx-6 -mb-3 z-10"
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        <ContentContainer>
          <InputForm
            id={fieldId}
            label={title}
            initialValue={value}
            onCancel={handleCancel}
          />
        </ContentContainer>
      </motion.div> */}
    </div>
  );
};

export default HolidayHoursCard;

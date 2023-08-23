import * as React from "react";
import Card from "../Card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useEntity } from "../utils/useEntityContext";
import Hours from "../Hours";

import {
  DayIntervalType as DayIntervalType,
  HolidayHourType as HolidayHourType,
} from "@/src/types/yext";
import ContentContainer from "../ContentContainer";
import HoursForm from "../form/HoursForm";
import { twMerge } from "tailwind-merge";

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
  };
}

const HoursCard = ({ title, fieldId, hours }: HoursCardProps) => {
  const [editMode, setEditMode] = useState(false);
  const [hidden, setHidden] = useState(true);

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

  return (
    // TODO: Is it bad to have onClick without button?
    <div onClick={() => setEditMode(true)}>
      <Card>
        <div className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2">
          {title}
        </div>
        <Hours hours={hours} />
      </Card>
      {/* TODO: move motion div and logic for hiding to its own component */}
      <motion.div
        initial={false}
        animate={{ y: editMode ? 0 : "100%" }}
        className={twMerge(
          "inset-0 absolute bg-white -mx-6 -mb-3 z-10",
          hidden && "hidden"
        )}
        onAnimationStart={() => {
          setHidden(false);
        }}
        onAnimationComplete={() => {
          !editMode && setHidden(true);
        }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        <ContentContainer containerClassName="pt-4 pb-20">
          <HoursForm
            id="hours"
            label="Hours"
            initialHours={hours}
            onCancel={handleCancel}
          />
        </ContentContainer>
      </motion.div>
    </div>
  );
};

export default HoursCard;

import * as React from "react";
import Card from "../Card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ContentContainer from "../ContentContainer";
import { useEntity } from "../utils/useEntityContext";
import TextareaForm from "../form/TextAreaForm";

export interface FieldCardProps {
  title: string;
  fieldId: string;
  value?: string;
}

const FieldCard = ({ title, fieldId, value }: FieldCardProps) => {
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
    <div onClick={() => setEditMode(true)}>
      <Card>
        <div className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2">
          {title}
        </div>
        <div className=" text-gray-700 text-sm font-lato-regular">{value}</div>
      </Card>
      <motion.div
        initial={false}
        animate={{ y: editMode ? 0 : "100%" }}
        className="inset-0 absolute bg-white -mx-6 -mb-3 z-10"
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        <ContentContainer>
          <TextareaForm
            id={fieldId}
            label={title}
            initialValue={value}
            onCancel={handleCancel}
          />
        </ContentContainer>
      </motion.div>
    </div>
  );
};

export default FieldCard;

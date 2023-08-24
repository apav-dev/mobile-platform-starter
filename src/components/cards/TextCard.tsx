import * as React from "react";
import { useEffect, useState } from "react";
import Card from "../Card";
import ContentContainer from "../ContentContainer";
import InputForm from "../form/InputForm";
import { useEntity } from "../utils/useEntityContext";
import EditPanel from "../EditPanel";

export interface FieldCardProps {
  title: string;
  fieldId: string;
  value?: string;
}

const TextCard = ({ title, fieldId, value }: FieldCardProps) => {
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
        <div className="text-gray-700 font-lato-regular">{value}</div>
      </Card>
      <EditPanel open={editMode}>
        <ContentContainer containerClassName="pt-4 pb-20">
          <InputForm
            id={fieldId}
            label={title}
            initialValue={value}
            onCancel={handleCancel}
          />
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

export default TextCard;

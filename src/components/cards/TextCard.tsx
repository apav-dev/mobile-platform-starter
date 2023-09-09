import * as React from "react";
import { useEffect } from "react";
import { Card } from "../Card";
import { ContentContainer } from "../ContentContainer";
import InputForm from "../form/InputForm";
import { usePageContext } from "../utils/usePageContext";
import EditPanel from "../EditPanel";
import Header from "../Header";
import { LocationPinIcon } from "../icons/LocationPinIcon";
import { Heading } from "../Heading";
import { render } from "react-dom";
import { renderEntityText } from "../utils/renderEntityText";

export interface TextCardProps {
  title: string;
  fieldId: string;
  value?: string;
  required?: boolean;
  minLen?: number;
  maxLen?: number;
}

export const TextCard = ({
  title,
  fieldId,
  value,
  required,
  maxLen,
  minLen,
}: TextCardProps) => {
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

  return (
    // TODO: Is it bad to have onClick without button?
    <div onClick={() => setEditId?.(fieldId)}>
      <Card>
        <div className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2">
          {title}
        </div>
        {renderEntityText(value ?? "")}
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
            <InputForm
              id={fieldId}
              label={title}
              initialValue={value}
              onCancel={handleCancel}
              required={required}
              minLen={minLen}
              maxLen={maxLen}
            />
          </div>
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

import * as React from "react";
import { useEffect } from "react";
import { Card } from "../Card";
import { ContentContainer } from "../ContentContainer";
import { usePageContext } from "../utils/usePageContext";
import TextareaForm from "../form/TextAreaForm";
import EditPanel from "../EditPanel";
import Header from "../Header";
import { LocationPinIcon } from "../icons/LocationPinIcon";
import { Heading } from "../Heading";
import { renderEntityText } from "../utils/renderEntityText";
import Skeleton from "../Skeleton";

export interface MulitlineCardProps {
  title: string;
  fieldId: string;
  value?: string;
}

export const MultilineTextCardSkeleton = () => {
  return (
    <Card containerClassName="flex flex-col gap-y-4">
      <Skeleton className="w-20 h-3" />
      <div className="flex flex-col gap-y-1">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
      </div>
    </Card>
  );
};

export const MultilineTextCard = ({
  title,
  fieldId,
  value,
}: MulitlineCardProps) => {
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
        {renderEntityText(value ?? "", "text-sm")}
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
            <TextareaForm
              id={fieldId}
              label={title}
              initialValue={value}
              onCancel={handleCancel}
            />
          </div>
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

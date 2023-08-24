import * as React from "react";
import { useEffect, useState } from "react";
import Card from "../Card";
import { useEntity } from "../utils/useEntityContext";
import { GalleryImage } from "@/src/types/yext";
import ImageCarousel from "../ImageCarousel";
import EditPanel from "../EditPanel";
import ContentContainer from "../ContentContainer";
import PhotoGalleryForm from "../form/PhotoGalleryForm";

export interface PhotoGalleryCardProps {
  title: string;
  fieldId: string;
  images: GalleryImage[];
}

const FieldCard = ({ title, fieldId, images }: PhotoGalleryCardProps) => {
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
        <div
          onClick={() => setEditMode(true)}
          className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2"
        >
          {title}
        </div>
        <ImageCarousel images={images} />
      </Card>
      <EditPanel open={editMode}>
        <ContentContainer containerClassName="pt-4 pb-20">
          <PhotoGalleryForm
            id={"photoGallery"}
            label="Photo Gallery"
            onCancel={handleCancel}
            initialImages={images}
          />
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

export default FieldCard;

import * as React from "react";
import { useEffect } from "react";
import { Card } from "../Card";
import { usePageContext } from "../utils/usePageContext";
import { GalleryImage } from "../../types/yext";
import { ImageCarousel } from "../ImageCarousel";
import EditPanel from "../EditPanel";
import { ContentContainer } from "../ContentContainer";
import { PhotoGalleryForm } from "../form/PhotoGalleryForm";
import { LocationPinIcon } from "../icons/LocationPinIcon";
import { Heading } from "../Heading";
import Header from "../Header";

export interface PhotoGalleryCardProps {
  title: string;
  fieldId: string;
  images: GalleryImage[];
}

export const PhotoGalleryCard = ({
  title,
  fieldId,
  images,
}: PhotoGalleryCardProps) => {
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
    <div
    // onClick={() => setEditMode(true)}
    >
      <Card>
        <div
          onClick={() => setEditId?.(fieldId)}
          className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2"
        >
          {title}
        </div>
        <ImageCarousel images={images} />
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
            <PhotoGalleryForm
              id={"photoGallery"}
              label="Photo Gallery"
              onCancel={handleCancel}
              initialImages={images}
            />
          </div>
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

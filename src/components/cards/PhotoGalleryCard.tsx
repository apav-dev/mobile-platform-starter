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
import Skeleton from "../Skeleton";
import { useTranslation } from "react-i18next";

export interface PhotoGalleryCardProps {
  title: string;
  fieldId: string;
  images?: GalleryImage[];
}

export const PhotoGalleryCardSkeleton = () => {
  return (
    <Card containerClassName="flex flex-col gap-y-4">
      <Skeleton className="w-20 h-3" />
      <Skeleton className="mx-auto h-80 w-64" />
    </Card>
  );
};

export const PhotoGalleryCard = ({
  title,
  fieldId,
  images,
}: PhotoGalleryCardProps) => {
  const { formData, entityMeta, setEditId, editId } = usePageContext();
  const { t } = useTranslation();

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
    <div>
      <Card>
        <div
          onClick={() => setEditId?.(fieldId)}
          className="self-stretch text-gray-700 text-base font-lato-bold font-normal leading-tight mb-2 "
        >
          {title}
        </div>
        {!images || images?.length === 0 ? (
          <div className="px-4 py-3 bg-zinc-200 rounded-[3px] justify-center items-center gap-2 flex w-full font-lato-regular">
            {t("addField", { field: t(title) })}
          </div>
        ) : (
          <ImageCarousel images={images} />
        )}
      </Card>
      <EditPanel open={editId === fieldId}>
        <Header
          breadcrumbs={[
            {
              name: t("Home"),
              path: "/",
            },
            { name: entityMeta?.name ?? "", onClick: handleCancel },
            { name: `${t("Edit")} ${title}` },
          ]}
        />
        <ContentContainer containerClassName="pt-4 pb-20">
          <Heading title={entityMeta?.name ?? ""} icon={<LocationPinIcon />} />
          <div className="pt-4">
            <PhotoGalleryForm
              id={"photoGallery"}
              label={t("Photo Gallery")}
              onCancel={handleCancel}
              initialImages={images}
            />
          </div>
        </ContentContainer>
      </EditPanel>
    </div>
  );
};

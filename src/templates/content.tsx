import * as React from "react";
import { useEffect, useState } from "react";
import "../index.css";
import {
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
  TemplateProps,
} from "@yext/pages";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Heading, HeadingSkeleton } from "../components/Heading";
import { ContentContainer } from "../components/ContentContainer";
import {
  HolidayHoursCard,
  HoildayHoursCardSkeleton,
} from "../components/cards/HolidayHoursCard";
import { HoursCard, HoursCardSkeleton } from "../components/cards/HoursCard";
import {
  MultilineTextCard,
  MultilineTextCardSkeleton,
} from "../components/cards/MultilineTextCard";
import {
  PhotoGalleryCard,
  PhotoGalleryCardSkeleton,
} from "../components/cards/PhotoGalleryCard";
import { TextCard, TextCardSkeleton } from "../components/cards/TextCard";
import { LocationPinIcon } from "../components/icons/LocationPinIcon";
import { Main } from "../components/layouts/Main";
import { PageContextProvider } from "../components/utils/usePageContext";
import { editLocation, fetchLocation } from "../utils/api";
import { toast } from "../components/utils/useToast";
import Skeleton from "../components/Skeleton";
import { useTranslation } from "react-i18next";

export const getPath: GetPath<TemplateProps> = () => {
  return "content";
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Content",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};
const Content = () => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [entityId, setEntityId] = useState<string | undefined>();
  const [editId, setEditId] = useState<string | number>("");

  const { t } = useTranslation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const entityId = urlParams.get("entityId");
    setEntityId(entityId);
  }, []);

  const contentQuery = useQuery({
    queryKey: ["entityId", entityId],
    retry: false,
    queryFn: () => fetchLocation(entityId),
  });

  const location =
    contentQuery.data?.response &&
    Object.keys(contentQuery.data?.response).length > 0
      ? contentQuery.data?.response
      : undefined;

  const contentMutation = useMutation({
    mutationFn: editLocation,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: t("Failed to Edit Entity"),
        description: t("There was a problem with your request"),
      });
    },
    onSuccess: (response) => {
      setFormData({});
      contentQuery.refetch();
      toast({
        title: t("Entity Updated"),
        description: t("Successfully updated entity"),
        duration: 5000,
      });
    },
  });

  useEffect(() => {
    if (entityId && Object.keys(formData).length > 0) {
      contentMutation.mutate({ entityId, location: formData });
    }
  }, [formData]);

  return (
    <PageContextProvider
      value={{
        formData,
        setFormData,
        entityMeta: location && {
          id: location?.id,
          name: location?.name,
        },
        setEditId,
        editId,
      }}
    >
      <Main
        breadcrumbs={[
          {
            name: "Home",
            path: "/",
          },
          { name: location?.name ?? "" },
        ]}
        disableScroll={!!editId}
      >
        {contentQuery.isLoading ? (
          <ContentContainer>
            <div className="flex flex-col gap-y-4">
              <HeadingSkeleton />
              <div className="py-4">
                <div className="justify-start items-center gap-2 inline-flex">
                  <div className="text-gray-700 font-lato-bold">{`${t(
                    "ID"
                  )}:`}</div>
                  <div className="text-gray-700 font-lato-regular">
                    <Skeleton className="w-20 h-3" />
                  </div>
                  <div className="text-gray-700 text-[13px] font-bold">|</div>
                  <div className="justify-start items-center gap-2 flex">
                    <div className="text-gray-700 font-lato-bold">{`${t(
                      "Type"
                    )}:`}</div>
                    <div className="inline-flex items-center gap-1">
                      <LocationPinIcon />
                      <div className="text-gray-700 font-lato-regular">
                        <Skeleton className="w-20 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-4">
                  <TextCardSkeleton />
                  <MultilineTextCardSkeleton />
                  <PhotoGalleryCardSkeleton />
                  <HoursCardSkeleton />
                  <HoildayHoursCardSkeleton />
                </div>
              </div>
            </div>
          </ContentContainer>
        ) : (
          <>
            {location && (
              <ContentContainer>
                <Heading title={location.name} icon={<LocationPinIcon />} />
                <div className="py-4">
                  <div className="justify-start items-center gap-2 inline-flex">
                    <div className="text-gray-700 font-lato-bold">{`${t(
                      "ID"
                    )}:`}</div>
                    <div className="text-gray-700 font-lato-regular">
                      {location.meta?.id}
                    </div>
                    <div className="text-gray-700 text-[13px] font-bold">|</div>
                    <div className="justify-start items-center gap-2 flex">
                      <div className="text-gray-700 font-lato-bold">{`${t(
                        "Type"
                      )}:`}</div>
                      <div className="inline-flex items-center gap-1">
                        <LocationPinIcon />
                        <div className="text-gray-700 font-lato-regular">
                          {location.meta?.entityType}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative flex flex-col gap-y-2">
                  <TextCard
                    title={t("Name")}
                    fieldId="name"
                    value={location.name}
                    required
                  />
                  <MultilineTextCard
                    title={t("Description")}
                    fieldId="description"
                    value={location.description}
                  />
                  <PhotoGalleryCard
                    title={t("Photo Gallery")}
                    fieldId="photoGallery"
                    images={location.photoGallery}
                  />
                  <HoursCard
                    title={t("Hours")}
                    fieldId="hours"
                    hours={location.hours}
                  />
                  <HolidayHoursCard
                    title={t("Holiday Hours")}
                    id="holidayHours"
                    hoursFieldId="hours"
                    hours={location.hours}
                  />
                  <HoursCard
                    title={t("Drive-Through Hours")}
                    fieldId="driveThroughHours"
                    hours={location.driveThroughHours}
                  />
                  <HolidayHoursCard
                    title={t("Drive-Through Holiday Hours")}
                    id="driveThroughHolidayHours"
                    hoursFieldId="driveThroughHours"
                    hours={location.driveThroughHours}
                  />
                  <HoursCard
                    title={t("Pickup Hours")}
                    fieldId="pickupHours"
                    hours={location.pickupHours}
                  />
                  <HolidayHoursCard
                    title={t("Pickup Holiday Hours")}
                    id="pickupHolidayHours"
                    hoursFieldId="pickupHours"
                    hours={location.pickupHours}
                  />
                </div>
              </ContentContainer>
            )}
          </>
        )}
      </Main>
    </PageContextProvider>
  );
};

export default Content;

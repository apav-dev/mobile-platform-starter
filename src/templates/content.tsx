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
import { Heading } from "../components/Heading";
import { ContentContainer } from "../components/ContentContainer";
import { HolidayHoursCard } from "../components/cards/HolidayHoursCard";
import { HoursCard } from "../components/cards/HoursCard";
import { MultilineTextCard } from "../components/cards/MultilineTextCard";
import { PhotoGalleryCard } from "../components/cards/PhotoGalleryCard";
import { TextCard } from "../components/cards/TextCard";
import { LocationPinIcon } from "../components/icons/LocationPinIcon";
import { Main } from "../components/layouts/Main";
import { PageContextProvider } from "../components/utils/usePageContext";
import { editLocation, fetchLocation } from "../utils/api";
import { twMerge } from "tailwind-merge";
import { toast } from "../components/utils/useToast";
import { set } from "date-fns";

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

// TODO: submit and toast
// TODO: handle error
// TODO: handle loading
// TODO: Upload Images from Phone
// TODO: Upload Images from Assets
const Content = () => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [entityId, setEntityId] = useState<string | null>(null);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const entityId = urlParams.get("entityId");
    setEntityId(entityId);
  }, []);

  const contentQuery = useQuery({
    queryKey: ["entityId", entityId],
    enabled: !!entityId && Object.keys(formData).length === 0,
    retry: false,
    queryFn: () => fetchLocation(entityId),
  });

  const location = contentQuery.data?.response;

  const contentMutation = useMutation({
    mutationFn: editLocation,
    onError: (error) => {
      // toast({
      //   variant: "destructive",
      //   title: "Uh oh! Something went wrong.",
      //   description: "There was a problem with your request.",
      //   action: <ToastAction altText="Try again">Try again</ToastAction>,
      // });
    },
    onSuccess: (response) => {
      setFormData({});
      contentQuery.refetch();
      toast({
        title: "Entity Updated",
        description: "Successfully updated entity.",
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
      >
        {location && (
          <ContentContainer
            containerClassName={twMerge(editId && "overflow-y-hidden")}
          >
            <Heading title={location.name} icon={<LocationPinIcon />} />
            <div className="py-4">
              <div className="justify-start items-center gap-2 inline-flex">
                <div className="text-gray-700 font-lato-bold">ID:</div>
                <div className="text-gray-700 font-lato-regular">
                  {location.meta.id}
                </div>
                <div className="text-gray-700 text-[13px] font-bold">|</div>
                <div className="justify-start items-center gap-2 flex">
                  <div className="text-gray-700 font-lato-bold">Type:</div>
                  <div className="inline-flex items-center gap-1">
                    <LocationPinIcon />
                    <div className="text-gray-700 font-lato-regular">
                      {location.meta.entityType}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col gap-y-2">
              <TextCard
                title="Name"
                fieldId="name"
                value={location.name}
                required
              />
              <MultilineTextCard
                title="Description"
                fieldId="description"
                value={location.description}
              />
              <PhotoGalleryCard
                title="Photo Gallery"
                fieldId="photoGallery"
                images={location.photoGallery}
              />
              <HoursCard title="Hours" fieldId="hours" hours={location.hours} />
              <HolidayHoursCard
                title="Holiday Hours"
                fieldId="holidayHours"
                hours={location.hours}
              />
            </div>
          </ContentContainer>
        )}
      </Main>
    </PageContextProvider>
  );
};

export default Content;

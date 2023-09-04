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
import { useQuery } from "@tanstack/react-query";
import Heading from "../components/Heading";
import ContentContainer from "../components/ContentContainer";
import HolidayHoursCard from "../components/cards/HolidayHoursCard";
import HoursCard from "../components/cards/HoursCard";
import MultilineTextCard from "../components/cards/MultilineTextCard";
import PhotoGalleryCard from "../components/cards/PhotoGalleryCard";
import TextCard from "../components/cards/TextCard";
import { LocationPinIcon } from "../components/icons/LocationPinIcon";
import Main from "../components/layouts/Main";
import { EntityProvider } from "../components/utils/useEntityContext";
import { fetchLocation } from "../utils/api";

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

const Content = ({ document }: TemplateRenderProps) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [entityId, setEntityId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const entityId = urlParams.get("entityId");
    setEntityId(entityId);
  }, []);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["entityId", entityId],
    enabled: !!entityId,
    retry: false,
    queryFn: () => fetchLocation(entityId),
  });

  const location = data?.response.docs?.[0];

  return (
    <EntityProvider
      value={{
        formData,
        setFormData,
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
          <ContentContainer containerClassName="">
            <Heading title={location.name} icon={<LocationPinIcon />} />
            <div className="py-4">
              <div className="justify-start items-center gap-2 inline-flex">
                <div className="text-gray-700 font-lato-bold">ID:</div>
                <div className="text-gray-700 font-lato-regular">
                  {location.id}
                </div>
                <div className="text-gray-700 text-[13px] font-bold">|</div>
                <div className="justify-start items-center gap-2 flex">
                  <div className="text-gray-700 font-lato-bold">Type:</div>
                  <div className="inline-flex items-center gap-1">
                    <LocationPinIcon />
                    <div className="text-gray-700 font-lato-regular">
                      {location.meta.entityType.id}
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
                fieldId="hours"
                hours={location.hours}
              />
            </div>
          </ContentContainer>
        )}
      </Main>
    </EntityProvider>
  );
};

export default Content;

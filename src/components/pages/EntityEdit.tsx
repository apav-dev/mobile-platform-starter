import * as React from "react";
import Main from "../layouts/Main";
import ContentContainer from "../ContentContainer";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLocation } from "../../utils/api";
import Heading from "../Heading";
import { LocationPinIcon } from "../icons/LocationPinIcon";

import { EntityProvider } from "../utils/useEntityContext";
import TextCard from "../cards/TextCard";
import MultilineTextCard from "../cards/MultilineTextCard";
import PhotoGalleryCard from "../cards/PhotoGalleryCard";
import HoursCard from "../cards/HoursCard";
import HolidayHoursCard from "../cards/HolidayHoursCard";

const EntityEdit = () => {
  const [entityId, setEntityId] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const entityId = urlParams.get("entityId");

    if (entityId) {
      setEntityId(entityId);
    }
  }, []);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["entityId", entityId],
    enabled: !!entityId,
    retry: false,
    queryFn: () => fetchLocation(entityId),
  });

  const location = data?.response.docs?.[0];

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

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
              {/* hours except for holidayHours */}
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

export default EntityEdit;

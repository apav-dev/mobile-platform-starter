import * as React from "react";
import Main from "../layouts/Main";
import ContentContainer from "../ContentContainer";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLocation } from "../../utils/api";
import Heading from "../Heading";
import { LocationPinIcon } from "../icons/LocationPinIcon";
import FieldCard from "../FieldCard";
import ImageCarousel from "../ImageCarousel";
import Hours from "../Hours";

const Entity = () => {
  const [entityId, setEntityId] = useState<string>("");

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

  return (
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
        <ContentContainer>
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
          <div className="flex flex-col gap-y-2">
          <FieldCard title="Name">
            <div className="text-gray-700 font-lato-regular">
              {location.name}
            </div>
          </FieldCard>
          <FieldCard title="Description">
          <div className=" text-gray-700 text-sm font-lato-regular">
            {location.description}
          </div>
          </FieldCard>
          <FieldCard title="Photo Gallery">
            <ImageCarousel images={location.photoGallery} />
          </FieldCard>
          <FieldCard title="Hours">
            <Hours hours={location.hours}/>
          </FieldCard>
          <FieldCard title="Holiday Hours">
            <Hours hours={location.hours} renderHolidayHours={true}/>
          </FieldCard>
          </div>

        </ContentContainer>
      )}
    </Main>
  );
};

export default Entity;

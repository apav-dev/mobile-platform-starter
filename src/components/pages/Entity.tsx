import * as React from "react";
import Main from "../layouts/Main";
import ContentContainer from "../ContentContainer";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLocation, fetchReviews } from "../../utils/api";

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

  return (
    <Main
      breadcrumbs={[
        {
          name: "Home",
          path: "/",
        },
        { name: "Zenith" },
      ]}
    >
      <ContentContainer></ContentContainer>
    </Main>
  );
};

export default Entity;

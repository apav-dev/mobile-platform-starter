import { getRuntime } from "@yext/pages/util";
import * as React from "react";

const runtime = getRuntime();

export default function permissionedEntity() {
  const [entity, setEntity] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    async function fetchPermissionedEntity() {
      try {
        const token = window?.YEXT_TOKENS?.AUTH_SEARCH.token;
        if (!token) {
          console.log("no token found on window");
          //   return;
          setEntity("#");
        }
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
        };
        const searchResults = await fetch(
          "https://cdn.yextapis.com/v2/accounts/me/search/vertical/query?input=locations&locale=en&verticalKey=locations&experienceKey=mobile-starter-search&version=PRODUCTION&v=20230907",
          requestOptions
        ).then((response) => response.json());
        const entityId = searchResults.response.results[0].data.id;
        setEntity(entityId);
        //   setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    if (!runtime.isServerSide) {
      fetchPermissionedEntity();
    }
  }, []);

  return entity;
}

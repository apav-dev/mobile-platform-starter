import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch, getRuntime } from "@yext/pages/util";

type Metrics = "PAGE_VIEWS" | "TOTAL_LISTINGS_IMPRESSIONS" | "AVERAGE_RATING";
("NEW_REVIEWS");

type Filters = {
  startDate: Date;
  endDate: Date;
  locationIds: string[];
};

type Dimensions = "ENTITY_IDS";

type PostBody = {
  metrics: Metrics[];
  filters: Filters;
  dimensions: Dimensions[];
};

export default async function analytics(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, body, pathParams } = request;

  // TODO: Remove and only parse body after rc.3 is released
  const runtime = getRuntime();
  let bodyObj = {};
  if (runtime.name === "node") {
    bodyObj = body;
  } else if (runtime.name === "deno" && body) {
    bodyObj = JSON.parse(body);
  }

  switch (method) {
    case "POST":
      return fetchAnalytics(bodyObj, pathParams.entityId);
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

async function fetchAnalytics(
  postBody: Record<string, any>,
  entityId: string
): Promise<SitesHttpResponse> {
  if (!postBody) {
    return {
      body: "Missing required post information",
      headers: {},
      statusCode: 400,
    };
  }
  const newBody = postBody;
  postBody.filters.locationIds = [entityId];
  console.log(newBody);
  const mgmtApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/analytics/reports?api_key=${YEXT_PUBLIC_MGMT_API_KEY}&v=20230901`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBody),
    }
  );

  const resp = await mgmtApiResp.json();

  if (mgmtApiResp.status !== 201) {
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: mgmtApiResp.status,
    };
  } else {
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: 201,
    };
  }
}

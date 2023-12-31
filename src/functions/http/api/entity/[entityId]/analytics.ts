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

  switch (method) {
    case "POST":
      if (!body) {
        return { body: "Missing entity body", headers: {}, statusCode: 400 };
      }
      const bodyObj = JSON.parse(body);
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
  newBody.filters.locationIds = [entityId];
  const mgmtApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/analytics/reports?api_key=${YEXT_PUBLIC_YEXT_API_KEY}&v=20230901`,
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

import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch } from "@yext/pages/util";

export default async function entity(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams } = request;

  switch (method) {
    case "GET":
      return getEntity(pathParams.entityId);
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

async function getEntity(entityId?: string): Promise<SitesHttpResponse> {
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  const mgmtApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/entities/${entityId}?api_key=${YEXT_PUBLIC_MGMT_API_KEY}&v=20230901`
  );

  const resp = await mgmtApiResp.json();

  return {
    body: JSON.stringify(resp),
    headers: {},
    statusCode: 200,
  };
}

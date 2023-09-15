import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch } from "@yext/pages/util";
import { z, ZodObject, ZodSchema, ZodTypeAny } from "zod";
import { format } from "date-fns";

export default async function entityPosts(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, queryParams } = request;

  switch (method) {
    case "GET":
      return getEntityPosts(queryParams);
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

async function getEntityPosts(queryParams: {
  [key: string]: string;
}): Promise<SitesHttpResponse> {
  const params = new URLSearchParams(queryParams);

  const reqUrl = `https://api.yext.com/v2/accounts/me/posts?${params}`;

  const mgmtApiResp = await fetch(reqUrl);

  const resp = await mgmtApiResp.json();

  return {
    body: JSON.stringify(resp),
    headers: {},
    statusCode: 200,
  };
}

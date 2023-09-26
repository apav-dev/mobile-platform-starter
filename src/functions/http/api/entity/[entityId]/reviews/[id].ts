import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch } from "@yext/pages/util";

export default async function entityReviews(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams, queryParams } = request;

  const { id } = pathParams;

  console.log("hello from request");

  switch (method) {
    case "GET":
      return getReview(id);
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

async function getReview(reviewId?: string): Promise<SitesHttpResponse> {
  if (!reviewId) {
    return { body: "Missing reviewId", headers: {}, statusCode: 400 };
  }

  const params = new URLSearchParams({
    api_key: YEXT_PUBLIC_MGMT_API_KEY,
    v: "20230901",
  });

  const reqUrl = `https://api.yext.com/v2/accounts/me/reviews/${reviewId}?${params}`;

  const mgmtApiResp = await fetch(reqUrl);

  const resp = await mgmtApiResp.json();

  return {
    body: JSON.stringify(resp),
    headers: {},
    statusCode: 200,
  };
}

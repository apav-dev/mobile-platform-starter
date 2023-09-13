import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch, getRuntime } from "@yext/pages/util";

export default async function comment(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams, body } = request;

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
      return createComment(pathParams.entityId, pathParams.reviewId, bodyObj);
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

async function createComment(
  entityId?: string,
  reviewId?: string,
  commentBody?: Record<string, any>
): Promise<SitesHttpResponse> {
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  } else if (!reviewId) {
    return { body: "Missing review id", headers: {}, statusCode: 400 };
  } else if (!commentBody || !commentBody.content) {
    return { body: "Missing comment body", headers: {}, statusCode: 400 };
  }

  const mgmtApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/reviews/${reviewId}/comments?api_key=${YEXT_PUBLIC_MGMT_API_KEY}&v=20230901`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: commentBody.content,
        parentId: commentBody.parentId,
        visibility: "PUBLIC",
      }),
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

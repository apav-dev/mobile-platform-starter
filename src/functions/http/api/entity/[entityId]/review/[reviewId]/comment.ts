import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch } from "@yext/pages/util";

export default async function comment(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams, body } = request;

  // TODO: Parse body after it is fixed in Pages 1.0.0-rc.3
  const commentBody = body as unknown as Record<string, any>;

  switch (method) {
    case "POST":
      return createComment(
        pathParams.entityId,
        pathParams.reviewId,
        commentBody
      );
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

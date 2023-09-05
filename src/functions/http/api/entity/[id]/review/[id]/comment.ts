import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch } from "@yext/pages/util";

export default async function comment(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams } = request;

  switch (method) {
    case "POST":
      return createComment(pathParams.id);
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

async function createComment(id?: string): Promise<SitesHttpResponse> {}

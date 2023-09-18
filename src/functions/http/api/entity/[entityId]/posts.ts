import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch, getRuntime } from "@yext/pages/util";
import { z, ZodObject, ZodSchema, ZodTypeAny } from "zod";
import { format } from "date-fns";

type PostBody = {
  entityIds: string[];
  publisher: "GOOGLE" | "FACEBOOK";
  text: string;
  clickthroughUrl?: string;
  photoUrls?: string[];
  postDate?: string;
  topicType?: string;
  callToActionType?:
    | "BOOK"
    | "CALL"
    | "LEARN_MORE"
    | "ORDER"
    | "BUY"
    | "SIGN_UP";
};

export default async function posts(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, body, queryParams, pathParams } = request;

  // TODO: Remove and only parse body after rc.3 is released
  const runtime = getRuntime();
  let bodyObj = {};
  if (runtime.name === "node") {
    bodyObj = body;
  } else if (runtime.name === "deno" && body) {
    bodyObj = JSON.parse(body);
  }

  switch (method) {
    case "GET":
      return getEntityPosts(queryParams, pathParams.entityId);
    case "POST":
      return createPost(bodyObj, pathParams.entityId);
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

async function getEntityPosts(
  queryParams: {
    [key: string]: string;
  },
  entityId: string
): Promise<SitesHttpResponse> {
  const params = new URLSearchParams(queryParams);
  params.append("entityIds", entityId);

  const reqUrl = `https://api.yext.com/v2/accounts/me/posts?${params}`;

  const mgmtApiResp = await fetch(reqUrl);

  const resp = await mgmtApiResp.json();

  return {
    body: JSON.stringify(resp),
    headers: {},
    statusCode: 200,
  };
}

async function createPost(
  postBody: Record<string, any>,
  entityId: string
): Promise<SitesHttpResponse> {
  if (!postBody || !postBody.data) {
    return {
      body: "Missing required post information",
      headers: {},
      statusCode: 400,
    };
  }

  const postApiBody: PostBody = {
    entityIds: [entityId],
    publisher: postBody.data.publisher,
    text: postBody.data.postText,
  };

  if (postBody.data.photoUrls) {
    postApiBody.photoUrls = [postBody.data.photoUrls];
  }

  if (postBody.data.publishSchedule === "later") {
    const postDate = new Date(postBody.data.scheduleDate);
    const timeValues = postBody.data.scheduleTime.split(":", 2);
    const newHours = timeValues[0];
    const newMinutes = timeValues[1];
    postDate.setHours(newHours);
    postDate.setMinutes(newMinutes);
    const utcDate = postDate.toUTCString();
    postApiBody.postDate = `${utcDate}`;
  }

  if (
    postBody.data.publisher === "GOOGLEMYBUSINESS" &&
    postBody.data.googleCtaType
  ) {
    postApiBody.clickthroughUrl =
      postBody.data.googleCtaType === "CALL"
        ? postBody.data.googleCtaPhone
        : postBody.data.googleCtaUrl;
    postApiBody.callToActionType = postBody.data.googleCtaType;
  }

  const mgmtApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/posts?api_key=${YEXT_PUBLIC_MGMT_API_KEY}&v=20230901`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postApiBody),
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
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

  switch (method) {
    case "GET":
      return getEntityPosts(queryParams, pathParams.entityId);
    case "POST":
      if (!body) {
        return { body: "Missing entity body", headers: {}, statusCode: 400 };
      }
      const bodyObj = JSON.parse(body);
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
    const utcYear = postDate.getUTCFullYear();
    const utcMonth = postDate.getUTCMonth() + 1;
    const utcDay = postDate.getUTCDate();
    const utcHours = postDate.getUTCHours();
    const utcMins = postDate.getUTCMinutes();
    const utcSecs = postDate.getUTCSeconds();
    const dateToPost = `${utcYear}-${utcMonth
      .toString()
      .padStart(2, "0")}-${utcDay.toString().padStart(2, "0")} ${utcHours
      .toString()
      .padStart(2, "0")}:${utcMins.toString().padStart(2, "0")}:${utcSecs
      .toString()
      .padStart(2, "0")}`;
    postApiBody.postDate = dateToPost;
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
    `https://api.yextapis.com/v2/accounts/me/posts?api_key=${YEXT_PUBLIC_YEXT_API_KEY}&v=20230901`,
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

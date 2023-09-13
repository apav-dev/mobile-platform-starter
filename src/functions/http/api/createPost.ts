import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch } from "@yext/pages/util";

type PostBody = {
  entityIds: string;
  publisher: "GOOGLE" | "FACEBOOK";
  text: string;
  clickthroughUrl?: string;
  photoUrls?: string;
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

export default async function post(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, body } = request;

  // TODO: Parse body after it is fixed in Pages 1.0.0-rc.3
  const postBody = body as unknown as Record<string, any>;

  switch (method) {
    case "POST":
      return createPost(postBody);
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

async function createPost(
  postBody: Record<string, any>
): Promise<SitesHttpResponse> {
  if (!postBody) {
    return {
      body: "Missing required post information",
      headers: {},
      statusCode: 400,
    };
  }

  const postApiBody: PostBody = {
    entityIds: postBody.entityId,
    publisher: postBody.publisher,
    text: postBody.postText,
  };

  if (postBody.photoUrls) {
    postApiBody.photoUrls = postBody.photoUrls;
  }

  if (postBody.publishSchedule === "later") {
    postApiBody.postDate = `${postBody.scheduleDate.getUTCFullYear()}:${postBody.scheduleDate.getUTCMonth()}:${postBody.scheduleDate.getUTCDate()} ${
      postBody.scheduleTime
    }`;
  }

  if (postBody.publisher === "GOOGLEMYBUSINESS") {
    postApiBody.clickthroughUrl =
      postBody.googleCtaType === "CALL"
        ? postBody.googleCtaPhone
        : postBody.googleCtaUrl;
    postApiBody.callToActionType = postBody.googleCtaType;
  }

  //   const mgmtApiResp = await fetch(
  //     `https://api.yextapis.com/v2/accounts/me/posts?api_key=${YEXT_PUBLIC_SOCIAL_TEST_API_KEY}&v=20230901`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(postApiBody),
  //     }
  //   );

  //   const resp = await mgmtApiResp.json();

  //   if (mgmtApiResp.status !== 201) {
  //     return {
  //       body: JSON.stringify(resp),
  //       headers: {},
  //       statusCode: mgmtApiResp.status,
  //     };
  //   } else {
  //     return {
  //       body: JSON.stringify(resp),
  //       headers: {},
  //       statusCode: 201,
  //     };
  //   }
  return {
    body: JSON.stringify(postApiBody),
    headers: {},
    statusCode: 200,
  };
}

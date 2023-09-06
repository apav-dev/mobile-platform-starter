import {
  Location,
  Review,
  ReviewResponse,
  YextContent,
  YextResponse,
} from "../types/yext";

// TODO: use MGMT API when it return CORS headers OR I can use serverless with 1.0.0 rc
// export const fetchLocation = async (
//   entityId: string
// ): Promise<YextResponse<Location>> => {
//   const response = await fetch(
//     `https://api.yextapis.com/v2/accounts/me/entities/${entityId}?api_key=${YEXT_PUBLIC_MGMT_API_KEY}&v=20230817`
//   );
//   const data = await response.json();
//   return data;
// };

export const fetchLocation = async (
  entityId: string
): Promise<YextResponse<YextContent<Location>>> => {
  const response = await fetch(
    `https://cdn.yextapis.com/v2/accounts/me/content/locations?api_key=${YEXT_PUBLIC_CONTENT_API_KEY}&v=20230817&id=${entityId}`
  );
  const data = await response.json();
  return data;
};

export const fetchReviews = async (
  entityId: string,
  limit?: number,
  pageToken?: string
): Promise<YextResponse<ReviewResponse>> => {
  const params = new URLSearchParams({
    api_key: YEXT_PUBLIC_CONTENT_API_KEY,
    v: "20230817",
    "entity.id": entityId,
    limit: limit?.toString() ?? "5",
  });

  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  const response = await fetch(
    `/api/entity/${entityId}/reviews?${params.toString()}`
  );

  const data = await response.json();
  return data;
};

export const submitReviewResponse = async () => {};

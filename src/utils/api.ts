import {
  Location,
  Review,
  ReviewResponse,
  YextContent,
  YextResponse,
} from "../types/yext";

export const fetchLocation = async (
  entityId: string
): Promise<YextResponse<Location>> => {
  const response = await fetch(`api/entity/${entityId}`);
  const data = await response.json();
  return data;
};

export const editLocation = async ({
  entityId,
  location,
}: {
  entityId: string;
  location: Partial<Location>;
}): Promise<YextResponse<Location>> => {
  const response = await fetch(`api/entity/${entityId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(location),
  });
  if (response.status !== 200) {
    throw new Error("Failed to update location");
  } else {
    const data = await response.json();
    return data;
  }
};

export const fetchLocationFromContentApi = async (
  entityId: string
): Promise<YextResponse<Location>> => {
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

export const createReviewComment = async ({
  entityId,
  reviewId,
  content,
}: {
  entityId: string;
  reviewId: string;
  content: string;
}): Promise<YextResponse<{ id: string }>> => {
  const response = await fetch(
    `/api/entity/${entityId}/review/${reviewId}/comment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        parentId: reviewId,
      }),
    }
  );

  const data = await response.json();
  return data;
};

export const uploadImageToCloudinary = async (
  image: File
): Promise<CloudinaryAsset> => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "mobile_platform");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/yext/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to upload image");
  }
  const data = await response.json();
  return data;
};

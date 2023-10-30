import { AwaitingResponseType } from "../components/ReviewFilters";
import { Location, Review, ReviewResponse, YextResponse } from "../types/yext";

interface FormData {
  publisher?: "GOOGLEMYBUSINESS" | "FACEBOOK";
  postText?: string;
  photoUrl?: string | undefined;
  googleCtaUrl?: string;
  googleCtaType?:
    | "BOOK"
    | "ORDER"
    | "BUY"
    | "LEARN_MORE"
    | "SIGN_UP"
    | "CALL"
    | undefined;
  googleCtaPhone?: string;
  publishSchedule?: "now" | "later";
  publishTime?: string;
  publishDate?: Date;
  readyToSubmit?: boolean;
  entityId: string;
}

export const fetchLocation = async (
  entityId?: string
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
    `https://cdn.yextapis.com/v2/accounts/me/content/locations?api_key=${YEXT_PUBLIC_YEXT_API_KEY}&v=20230817&id=${entityId}`
  );
  const data = await response.json();
  return data;
};

export const fetchReviews = async (
  entityId: string,
  limit?: number,
  pageToken?: string,
  searchQuery?: string,
  ratingRange?: [number, number],
  publisherIds?: string[],
  awaitingResponse?: AwaitingResponseType
): Promise<YextResponse<ReviewResponse>> => {
  const params = new URLSearchParams({
    api_key: YEXT_PUBLIC_YEXT_API_KEY,
    limit: limit?.toString() ?? "5",
  });

  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  if (searchQuery) {
    params.append("reviewContent", searchQuery);
  }

  if (ratingRange) {
    if (ratingRange[0] > 1) {
      params.append("minRating", ratingRange[0].toString());
    }
    if (ratingRange[1] < 5) {
      params.append("maxRating", ratingRange[1].toString());
    }
  }

  if (publisherIds) {
    params.append("publisherIds", publisherIds.toString());
  }

  if (
    awaitingResponse &&
    awaitingResponse !== AwaitingResponseType.ALL_REVIEWS
  ) {
    params.append("awaitingResponse", awaitingResponse);
  }

  const response = await fetch(
    `/api/entity/${entityId}/reviews?${params.toString()}`
  );

  const data = await response.json();
  return data;
};

export const fetchReview = async (
  entityId: string,
  reviewId: string
): Promise<YextResponse<Review>> => {
  const response = await fetch(`/api/entity/${entityId}/reviews/${reviewId}`);

  const data = await response.json();
  return data;
};

export const submitReviewResponse = async () => {};

export const fetchSocialPosts = async (
  entityId: string,
  pageToken?: string
): Promise<YextResponse<any>> => {
  const params = new URLSearchParams({
    api_key: YEXT_PUBLIC_YEXT_API_KEY,
    v: "20230901",
  });

  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  const response = await fetch(
    `/api/entity/${entityId}/posts?${params.toString()}`
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
    `/api/entity/${entityId}/reviews/${reviewId}/comment`,
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

export const createSocialPost = async (
  formData: FormData
): Promise<YextResponse<any>> => {
  const response = await fetch(`/api/entity/${formData.entityId}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: formData }),
  });
  const data = await response.json();
  return data;
};

export const uploadImageToCloudinary = async (
  image: File
): Promise<CloudinaryAsset> => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", YEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${YEXT_PUBLIC_CLOUDINARY_ENV_NAME}/image/upload`,
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

export const fetchAnalyticsForEntity = async (
  entityId: string,
  dateRange: number
): Promise<YextResponse<any>> => {
  const endDate = new Date();
  const endMonth = endDate.getMonth() + 1;
  const formattedEndDate = `${endDate.getFullYear()}-${endMonth
    .toString()
    .padStart(2, "0")}-${endDate.getDate().toString().padStart(2, "0")}`;
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - dateRange);
  const startMonth = startDate.getMonth() + 1;
  const formattedStartDate = `${startDate.getFullYear()}-${startMonth
    .toString()
    .padStart(2, "0")}-${startDate.getDate().toString().padStart(2, "0")}`;
  const response = await fetch(`/api/entity/${entityId}/analytics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      metrics: [
        "STOREPAGES_PAGEVIEWS",
        "TOTAL_LISTINGS_IMPRESSIONS",
        "AVERAGE_RATING",
        "NEW_REVIEWS",
      ],
      filters: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      },
      dimensions: ["ENTITY_IDS"],
    }),
  });
  const data = await response.json();
  return data;
};

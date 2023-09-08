import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch } from "@yext/pages/util";
import { z, ZodObject, ZodSchema, ZodTypeAny } from "zod";
import { format } from "date-fns";

export default async function entityReviews(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams, queryParams } = request;

  switch (method) {
    case "GET":
      return getEntityReviews(queryParams, pathParams.entityId);
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

async function getEntityReviews(
  queryParams: { [key: string]: string },
  entityId?: string
): Promise<SitesHttpResponse> {
  if (!entityId) {
    return { body: "Missing entityId", headers: {}, statusCode: 400 };
  }

  const params = new URLSearchParams({
    api_key: YEXT_PUBLIC_MGMT_API_KEY,
    v: "20230901",
    entityIds: entityId,
  });

  const validatedQueryParams = validateAndStringifyQueryParams(queryParams);

  const reqUrl = `https://api.yext.com/v2/accounts/me/reviews?${params}&${validatedQueryParams}`;

  const mgmtApiResp = await fetch(reqUrl);

  const resp = await mgmtApiResp.json();

  return {
    body: JSON.stringify(resp),
    headers: {},
    statusCode: 200,
  };
}

function validateAndStringifyQueryParams(queryParams: {
  [key: string]: string;
}) {
  const currentDate = format(new Date(), "yyyy-MM-dd");

  const QueryParamsSchema = z
    .object({
      limit: z
        .number()
        .or(z.string())
        .refine(
          (value) => {
            const num = typeof value === "string" ? Number(value) : value;
            return num >= 0 && num <= 100;
          },
          {
            message: "limit be between 0 and 100",
          }
        )
        .optional(),
      offset: z
        .number()
        .or(z.string())
        .refine(
          (value) => {
            const num = typeof value === "string" ? Number(value) : value;
            return num >= 0 && num <= 9999;
          },
          {
            message: "offset must be between 0 and 9999",
          }
        )
        .optional(),
      minRating: z
        .number()
        .or(z.string())
        .refine(
          (value) => {
            const num = typeof value === "string" ? Number(value) : value;
            return num >= 0 && num <= 5;
          },
          {
            message: "minRating must be between 0 and 5",
          }
        )
        .optional(),
      maxRating: z
        .number()
        .or(z.string())
        .refine(
          (value) => {
            const num = typeof value === "string" ? Number(value) : value;
            return num >= 0 && num <= 5;
          },
          {
            message: "maxRating must be between 0 and 5",
          }
        )
        .optional(),
      minPublisherDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine((value) => value <= currentDate, {
          message: "Date can be no later than the present date",
        })
        .optional(),
      maxPublisherDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine((value) => value <= currentDate, {
          message: "Date can be no later than the present date",
        })
        .optional(),
      minLastYextUpdateDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine((value) => value <= currentDate, {
          message: "Date can be no later than the present date",
        })
        .optional(),
      maxLastYextUpdateDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine((value) => value <= currentDate, {
          message: "Date can be no later than the present date",
        })
        .optional(),
      reviewContent: z.string().optional(),
      publisherIds: z.array(z.string()).optional(),
      awaitingResponse: z
        .enum(["REVIEW", "COMMENT", "REVIEW_OR_COMMENT"])
        .optional(),
    })
    .nonstrict();

  const validationResult = QueryParamsSchema.safeParse(queryParams);
  const validParams: Record<string, any> = {};

  if (validationResult.success) {
    const urlSearchParams = new URLSearchParams(
      validationResult.data as Record<string, string>
    );
    return urlSearchParams.toString();
  } else {
    // Iterate through the Zod errors and log them, while keeping valid fields
    for (const error of validationResult.error.errors) {
      if (error.path.length === 1) {
        const key = error.path[0];
        const message = error.message;

        // Log why the query parameter was stripped
        console.log(`Stripped ${key} from query params: ${message}`);
      } else if (error.path.length === 0) {
        // This would be the case for some global object errors which we can safely ignore
        // because we're interested in individual fields.
      } else {
        // Here you can handle nested errors if your object was more complex
        // Currently, as per your schema, this block won't be executed.
      }
    }

    // Filter out invalid fields and keep only valid ones
    for (const key in queryParams) {
      if (QueryParamsSchema.shape.hasOwnProperty(key)) {
        const value = queryParams[key];
        const fieldSchema =
          QueryParamsSchema.shape[key as keyof typeof QueryParamsSchema.shape];
        if (fieldSchema.safeParse(value).success) {
          validParams[key] = value;
        }
      }
    }

    const urlSearchParams = new URLSearchParams(
      validParams as Record<string, string>
    );
    return urlSearchParams.toString();
  }
}

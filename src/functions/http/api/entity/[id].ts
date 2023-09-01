import { fetch } from "@yext/pages/util";

class Response {
  body: string;
  headers: any;
  statusCode: number;

  constructor(body: string, headers: any, statusCode: number) {
    this.body = body;
    this.headers = headers || {
      "Content-Type": "application/json",
    };
    this.statusCode = statusCode;
  }
}

export default async function entity(request) {
  const { method, body, pathParams } = request;

  switch (method) {
    case "GET":
      return getEntity(pathParams.id);
    default:
      return new Response("Method not allowed", null, 405);
  }
}

async function getEntity(id?: string) {
  if (!id) {
    return new Response("Missing entity id", null, 400);
  }

  const mgmtApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/entities/${id}?api_key=${YEXT_PUBLIC_MGMT_API_KEY}&v=20230901`
  );

  const resp = await mgmtApiResp.json();

  return {
    body: JSON.stringify(resp),
    headers: null,
    statusCode: 200,
  };
}

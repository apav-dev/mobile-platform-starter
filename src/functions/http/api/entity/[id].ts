// import { fetch } from "@yext/pages/util";
// import axios from "axios";
// import fetch from "node-fetch";
// import { fetch } from "cross-fetch";

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
      break;
    default:
      return new Response("Method not allowed", null, 405);
  }

  // const { id } = pathParams;

  // if (!id) {
  //   return new Response("Missing entity id", null, 400);
  // }

  return new Response("Hello World", null, 200);

  // const response = await fetch(
  //   `https://api.yextapis.com/v2/accounts/me/entities/${id}?api_key=${YEXT_PUBLIC_MGMT_API_KEY}`,
  //   { method: "PUT", body }
  // );

  // const response = await axios.put(
  //   `https://api.yext.com/v2/accounts/me/entities/${id}?api_key=${YEXT_PUBLIC_MGMT_API_KEY}`,
  //   body
  // );

  // return {
  //   body: response,
  //   headers: null,
  //   statusCode: 200,
  // };
}

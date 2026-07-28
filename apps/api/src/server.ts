import { createServer, type Server } from "node:http";

import { createHealthResponse } from "./health.js";

export function createApiServer(): Server {
  return createServer((request, response) => {
    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
      });
      response.end(JSON.stringify(createHealthResponse()));
      return;
    }

    response.writeHead(404, {
      "content-type": "application/problem+json; charset=utf-8",
    });
    response.end(
      JSON.stringify({
        status: 404,
        title: "Not Found",
        type: "about:blank",
      }),
    );
  });
}

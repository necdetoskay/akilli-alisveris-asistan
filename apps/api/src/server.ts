import { createServer, type Server } from "node:http";

import { ApiRouter } from "./router.js";
import type { ApiDependencies } from "./deps.js";

export function createApiServer(deps?: ApiDependencies): Server {
  const router = deps ? new ApiRouter(deps) : null;

  return createServer((request, response) => {
    if (router) {
      void router.route(request, response);
      return;
    }

    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
      });
      response.end(
        JSON.stringify({
          service: "api",
          status: "ok",
          timestamp: new Date().toISOString(),
        }),
      );
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

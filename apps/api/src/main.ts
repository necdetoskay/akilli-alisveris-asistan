import { loadApiConfig } from "@akilli-alisveris/config";

import { createApiServer } from "./server.js";

const config = loadApiConfig();
const server = createApiServer();

server.listen(config.port, config.host, () => {
  console.log(`API listening on http://${config.host}:${config.port}`);
});

const shutdown = (): void => {
  server.close((error) => {
    if (error) {
      console.error("API shutdown failed", error);
      process.exitCode = 1;
      return;
    }

    process.exitCode = 0;
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

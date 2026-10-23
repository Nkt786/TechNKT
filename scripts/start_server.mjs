import fs from "node:fs";

if (fs.existsSync(".env")) {
  process.loadEnvFile(".env");
}

import { dev } from "astro";

try {
  const server = await dev({
    root: ".",
  });
  console.log("SERVER_ADDRESS:", server.address);
} catch (err) {
  console.error("Failed to start Astro dev server:", err);
  process.exit(1);
}

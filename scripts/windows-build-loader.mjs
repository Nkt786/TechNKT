import { pathToFileURL } from "node:url";
import path from "node:path";

const targetUrl = pathToFileURL(path.resolve("./scripts/windows-safe-helpers.mjs")).href;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "@astrojs/internal-helpers/fs") {
    return {
      format: "module",
      shortCircuit: true,
      url: targetUrl,
    };
  }
  return nextResolve(specifier, context);
}

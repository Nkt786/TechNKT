import { register } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

register(pathToFileURL(path.resolve("./scripts/windows-build-loader.mjs")).href, import.meta.url);

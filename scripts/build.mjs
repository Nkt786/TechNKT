import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const isWin = process.platform === "win32";
const env = { ...process.env };

if (isWin) {
  const registerUrl = pathToFileURL(path.resolve("./scripts/windows-register.mjs")).href;
  const opt = `--import "${registerUrl}"`;
  env.NODE_OPTIONS = env.NODE_OPTIONS ? `${env.NODE_OPTIONS} ${opt}` : opt;
}

const astroBin = path.resolve("./node_modules/astro/bin/astro.mjs");
const result = spawnSync(process.execPath, [astroBin, "build"], {
  stdio: "inherit",
  env,
});

process.exit(result.status !== null ? result.status : 1);


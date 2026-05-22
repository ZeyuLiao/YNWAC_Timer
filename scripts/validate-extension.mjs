import { access, readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "manifest.json",
  "src/background.js",
  "popup/popup.html",
  "popup/popup.js",
  "popup/popup.css",
  "options/options.html",
  "options/options.js",
  "options/options.css"
];

async function validate() {
  const manifestPath = path.join(root, "manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  if (manifest.manifest_version !== 3) {
    throw new Error("manifest.json must use manifest_version 3.");
  }

  for (const file of requiredFiles) {
    await access(path.join(root, file));
  }

  if (manifest.background?.service_worker) {
    const workerPath = path.join(root, manifest.background.service_worker);
    const workerStat = await stat(workerPath);

    if (!workerStat.isFile()) {
      throw new Error("Background service worker must point to a file.");
    }
  }

  console.log("Extension template looks good.");
}

async function run() {
  try {
    await validate();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

await run();

if (process.argv.includes("--watch")) {
  console.log("Watching extension files. Press Ctrl+C to stop.");
  watch(root, { recursive: true }, run);
}

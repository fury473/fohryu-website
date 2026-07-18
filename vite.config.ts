import { execFileSync } from "node:child_process";
import { defineConfig } from "vite";

const COMMITS_URL = "https://github.com/Fury473/fohryu-website/commits/main";
const SEMVER_TAG_PATTERN = "[0-9]*.[0-9]*.[0-9]*";

function readGitValue(args: string[]): string | null {
  try {
    return (
      execFileSync("git", args, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"]
      }).trim() || null
    );
  } catch {
    return null;
  }
}

function readAppVersion(): string {
  const tag = readGitValue(["describe", "--exact-match", "--tags", "--match", SEMVER_TAG_PATTERN]);

  if (tag) {
    return `v${tag}`;
  }

  return readGitValue(["rev-parse", "--short", "HEAD"]) ?? "dev";
}

export default defineConfig(({ command }) => ({
  define: {
    __FOHRYU_APP_VERSION__: JSON.stringify(readAppVersion()),
    __FOHRYU_COMMITS_URL__: JSON.stringify(COMMITS_URL),
    __FOHRYU_LAST_COMMIT_DATE__: JSON.stringify(readGitValue(["log", "-1", "--format=%cI"]))
  },
  server:
    command === "serve"
      ? {
          watch: {
            interval: 750,
            usePolling: true
          }
        }
      : undefined
}));

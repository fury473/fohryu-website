import { execFileSync } from "node:child_process";
import { defineConfig } from "vite";

const REPOSITORY_URL = "https://github.com/Fury473/fohryu-website";
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

function readSoftwareVersion(): string {
  const tag = readGitValue(["describe", "--tags", "--abbrev=0", "--match", SEMVER_TAG_PATTERN]);

  if (tag) {
    return `v${tag}`;
  }

  return "dev";
}

function readRevisionUrl(): string | null {
  const revision = readGitValue(["rev-parse", "HEAD"]);

  if (!revision) {
    return null;
  }

  return `${REPOSITORY_URL}/commit/${revision}`;
}

export default defineConfig(({ command }) => ({
  define: {
    __FOHRYU_COMMITS_URL__: JSON.stringify(COMMITS_URL),
    __FOHRYU_LAST_COMMIT_DATE__: JSON.stringify(readGitValue(["log", "-1", "--format=%cI"])),
    __FOHRYU_REVISION__: JSON.stringify(readGitValue(["rev-parse", "--short", "HEAD"]) ?? "dev"),
    __FOHRYU_REVISION_URL__: JSON.stringify(readRevisionUrl()),
    __FOHRYU_SOFTWARE_VERSION__: JSON.stringify(readSoftwareVersion())
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

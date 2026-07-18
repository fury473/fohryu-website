import { execFileSync } from "node:child_process";
import { defineConfig } from "vite";

const COMMITS_URL = "https://github.com/Fury473/fohryu-website/commits/main";

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

export default defineConfig({
  define: {
    __FOHRYU_COMMITS_URL__: JSON.stringify(COMMITS_URL),
    __FOHRYU_LAST_COMMIT_DATE__: JSON.stringify(readGitValue(["log", "-1", "--format=%cI"]))
  }
});

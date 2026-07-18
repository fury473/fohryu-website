import { execFileSync } from "node:child_process";

function runGit(args) {
  execFileSync("git", args, {
    stdio: "inherit"
  });
}

function readGit(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"]
  }).trim();
}

runGit(["fetch", "--tags", "--force"]);

if (readGit(["rev-parse", "--is-shallow-repository"]) === "true") {
  runGit(["fetch", "--tags", "--force", "--unshallow"]);
}

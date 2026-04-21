import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * GitHub project Pages URL is https://<owner>.github.io/<repo>/.
 * GITHUB_REPOSITORY is set in Actions as "owner/repo".
 */
function resolveBase(): string {
  const fromEnv = process.env.VITE_BASE_PATH?.trim();
  if (fromEnv) {
    if (fromEnv === "" || fromEnv === "/") return "/";
    return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;
  }
  const repo = process.env.GITHUB_REPOSITORY?.split("/")?.[1];
  if (repo) return `/${repo}/`;
  return "/";
}

export default defineConfig({
  base: resolveBase(),
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(root, "index.html"),
        greenhills: path.resolve(root, "greenhills.html"),
        whitehills: path.resolve(root, "whitehills.html"),
      },
    },
  },
});

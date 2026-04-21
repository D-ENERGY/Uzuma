/** Vite `base` + path under `public/` (no leading slash). */
export function assetUrl(pathUnderPublic: string): string {
  const base = import.meta.env.BASE_URL;
  const p = pathUnderPublic.replace(/^\//, "");
  return encodeURI(`${base}${p}`);
}

/** In-app path relative to site root (e.g. `greenhills/`). */
export function pageUrl(path = ""): string {
  const base = import.meta.env.BASE_URL;
  if (!path) return base;
  return `${base}${path.replace(/^\//, "")}`;
}

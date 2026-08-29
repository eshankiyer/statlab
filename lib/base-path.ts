// GitHub Pages project sites are served from a subpath (/statlab), not the
// domain root. Next's basePath option rewrites <Link>/router URLs
// automatically, but does not reliably rewrite raw /public asset URLs used
// in next/image (with images.unoptimized) or metadata icons at export time.
// Use this helper for any hardcoded /public asset path.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`
}

const basePath = "/statlab"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // next/image with unoptimized:true, and next/metadata icons, don't
  // reliably prefix static /public asset URLs with basePath at export
  // time, so components read this to build the path themselves.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig

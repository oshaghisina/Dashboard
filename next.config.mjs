import { fileURLToPath } from "node:url"

const rootDir = fileURLToPath(new URL("./", import.meta.url))

/** @type {import("next").NextConfig} */
const nextConfig = {
  typedRoutes: false,
  turbopack: {
    root: rootDir,
  },
}

export default nextConfig

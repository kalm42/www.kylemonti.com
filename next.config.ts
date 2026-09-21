import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	reactStrictMode: true,
	output: "export",
	// The static export has no server to run the Image Optimization API, so
	// next/image must serve files as-is (https://nextjs.org/docs/messages/export-image-api).
	images: {
		unoptimized: true,
	},
}

export default nextConfig

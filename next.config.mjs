/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // 🚀 Quick fix: Disable image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.x1nx3r.uk",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      // Add other image domains you might use
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

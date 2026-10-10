import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/reminders/:id",
        destination: "/reminders/:id",
        permanent: true,
      },
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "localhost:3001", 
        "localhost:3002",
        "*.app.github.dev",
      ],
    },
  },
}

export default nextConfig

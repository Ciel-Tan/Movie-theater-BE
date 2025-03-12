/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const allowedOrigins = [
      'https://movie-theater-be-api.vercel.app',
      'http://localhost:3000'
    ];

    return [
      {
        // Matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: allowedOrigins },
          { key: "Access-Control-Allow-Methods", value: "GET, DELETE, POST, PUT" },
          {
            key: "Access-Control-Allow-Headers", 
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" 
          }
        ]
      }
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'cms-production-219a.up.railway.app',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
            },
        ],
    },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.docln.net'
            },
            {
                protocol: 'https',
                hostname: 'i2.docln.net'
            },
            {
                protocol: 'https',
                hostname: 'i.hako.vn'
            },
        ],
    },
    sassOptions: {
        silenceDeprecations: ['legacy-js-api'],
    }
};

export default nextConfig;

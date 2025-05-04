/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'next-auth',
    '@auth/core',
    '@panva/hkdf',
    'jose',
    '@auth/prisma-adapter',
    'oauth4webapi/build',
    '@dicebear'
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false
      };
    }
    return config;
  }
};

export default nextConfig;

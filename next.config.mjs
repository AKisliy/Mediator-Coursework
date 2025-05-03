/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-auth', '@auth/core', '@panva/hkdf', 'jose'],
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

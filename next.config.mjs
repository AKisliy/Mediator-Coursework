/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-auth', '@auth/core', '@panva/hkdf', 'jose']
};

export default nextConfig;

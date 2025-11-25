/** @type {import('next').NextConfig} */
const nextConfig = {
  // Retirez "http://" et laissez juste l'IP
  allowedDevOrigins: ['192.168.56.1', 'localhost']
};

export default nextConfig;
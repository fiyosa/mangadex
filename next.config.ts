import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      //
      new URL('https://mangadex.org/**'),
      new URL('https://cdn1.comicknew.pictures/**'),
    ],
  },
}

export default nextConfig

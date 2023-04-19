/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GOOGLE_CUSTOM_SEARCH_KEY: process.env.GOOGLE_CUSTOM_SEARCH_KEY,
    GOOGLE_SEARCH_ENGINE_ID: process.env.GOOGLE_SEARCH_ENGINE_ID
  }
}

module.exports = nextConfig

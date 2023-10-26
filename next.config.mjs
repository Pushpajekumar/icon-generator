/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: [
      "icon-generator2130.s3.ap-south-1.amazonaws.com",
      "icon-generator2130.s3.amazonaws.com",
    ],
  },
};

export default config;

// Build hash generation for cache versioning
export function generateBuildHash() {
  // Generate a simple hash based on timestamp and random string
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

// Current build version - this should be updated on each deployment
export const BUILD_VERSION = '1.0.0';
export const BUILD_HASH = generateBuildHash();

// Full cache name
export const CACHE_NAME = `dub5-v${BUILD_VERSION}.${BUILD_HASH}`;

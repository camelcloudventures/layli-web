/**
 * Base URL for API requests
 * @throws Error if BASE_URL environment variable is not set
 */
export const baseUrl = (() => {
  const url = process.env.BASE_URL;

  console.log("baseUrl", url);
  if (!url) {
    throw new Error("BASE_URL environment variable is required");
  }
  return url;
})();

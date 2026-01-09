/**
 * Gets the API URL from environment variables, checking if it's a valid value
 * (not the build-time placeholder '__URL__').
 *
 * @returns The API URL if valid, or an empty string if not set or is a placeholder
 */
export const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return apiUrl && apiUrl !== '__URL__' ? apiUrl : '';
};

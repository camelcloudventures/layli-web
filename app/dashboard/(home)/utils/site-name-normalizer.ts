/**
 * Normalizes site names for consistent display across charts and UI components.
 * Handles trimming, removing trailing dashes, proper capitalization, and edge cases.
 */
export function normalizeSiteName(siteName: string | null | undefined): string {
  if (!siteName) {
    return "";
  }

  // Trim whitespace
  let normalized = siteName.trim();

  // Remove trailing dashes, underscores, and other special characters
  normalized = normalized.replace(/[-_\s]+$/, "");

  // Remove leading dashes, underscores, and other special characters
  normalized = normalized.replace(/^[-_\s]+/, "");

  // Trim again after removing special characters
  normalized = normalized.trim();

  // Handle empty strings after normalization
  if (normalized === "") {
    return "";
  }

  // Convert to Title Case (capitalize first letter of each word)
  // Split by spaces, dashes, or underscores, capitalize each word, then join
  const words = normalized.split(/[\s\-_]+/).filter((word) => word.length > 0);
  normalized = words
    .map((word) => {
      // Capitalize first letter, lowercase the rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  return normalized;
}

/**
 * Normalizes and truncates site names for display in charts with limited space.
 * Ensures consistent formatting and truncation for visual uniformity.
 * @param siteName - The site name to normalize and truncate
 * @param maxLength - Maximum length before truncation (default: 30)
 * @returns Normalized and optionally truncated site name
 */
export function normalizeAndTruncateSiteName(
  siteName: string | null | undefined,
  maxLength: number = 30
): string {
  const normalized = normalizeSiteName(siteName);

  if (normalized.length === 0) {
    return "";
  }

  // Truncate if longer than maxLength
  if (normalized.length > maxLength) {
    return `${normalized.substring(0, maxLength)}...`;
  }

  return normalized;
}

/**
 * Generates abbreviations for site names and provides a map for full names.
 * @param data - The chart data with full site names.
 * @returns An object with processed data (using abbreviations) and a name map.
 */
export function abbreviateSiteNames<T extends { site_name: string }>(
  data: T[]
): {
  processedData: (T & { abbreviated_name: string })[];
  nameMap: Record<string, string>;
} {
  const nameMap: Record<string, string> = {};
  const abbreviationCount: Record<string, number> = {};

  const processedData = data.map((item) => {
    const words = item.site_name.split(" ");
    let abbreviation = words
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

    // Ensure abbreviation is unique
    if (abbreviationCount[abbreviation]) {
      abbreviationCount[abbreviation]++;
      abbreviation = `${abbreviation}${abbreviationCount[abbreviation]}`;
    } else {
      abbreviationCount[abbreviation] = 1;
    }

    nameMap[abbreviation] = item.site_name;

    return {
      ...item,
      abbreviated_name: abbreviation,
    };
  });

  return { processedData, nameMap };
}

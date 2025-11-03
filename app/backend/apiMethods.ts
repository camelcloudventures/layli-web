"use server";
import { baseUrl } from "./base";
import { cookies } from "next/headers";

// Constants
const COOKIE_NAMES = {
  ACTIVE_ORG: "active_org",
  SUPABASE_AUTH: "sb-auth-token",
} as const;

const ERROR_MESSAGES = {
  NOT_LOGGED_IN: "You are not logged in",
  NO_ACTIVE_ORG: "No active organization selected",
  UNEXPECTED_FORMAT: "Unexpected response format",
  INVALID_COOKIE: "Invalid cookie format",
  DECODE_FAILED: "Failed to decode session cookie",
  NO_ACCESS_TOKEN: "No access token found",
} as const;

const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

// Type definitions
interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
}

interface SessionObject {
  access_token: string;
  refresh_token?: string;
}

/**
 * Gets the Supabase cookie name based on the project reference
 * @returns The formatted cookie name for Supabase authentication
 */
function getSupabaseCookieName(): string {
  const projectRef = process.env
    .NEXT_PUBLIC_SUPABASE_URL!.replace("https://", "")
    .split(".")[0];
  return `sb-${projectRef}-auth-token`;
}

/**
 * Retrieves the active organization ID from cookies
 * @returns The active organization ID or null if not found
 */
async function getActiveOrgId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.ACTIVE_ORG)?.value || null;
}

/**
 * Extracts the access token from Supabase session cookie
 * @returns The access token or null if not found or invalid
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(getSupabaseCookieName())?.value;
  if (!raw) return null;

  const [prefix, b64] = raw.split("-", 2);
  if (prefix !== "base64" || !b64) {
    return null;
  }

  let sessionObj: SessionObject;
  try {
    sessionObj = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  } catch {
    return null;
  }

  const token = sessionObj?.access_token;
  if (!token) {
    return null;
  }

  return token;
}

/**
 * Base HTTP request function that handles common logic for all API calls
 * @param url - The API endpoint URL
 * @param method - The HTTP method
 * @param data - The request data (optional)
 * @param needsAuth - Whether authentication is required
 * @param skipOrgCheck - Whether to skip organization check
 * @param tags - Cache tags for Next.js
 * @returns Promise resolving to the API response or error
 */
async function makeHttpRequest(
  url: string,
  method: string,
  data?: unknown,
  needsAuth: boolean = true,
  skipOrgCheck: boolean = false,
  tags?: string[]
) {
  try {
    let accessToken: string | undefined;
    let activeOrgId: string | undefined;

    if (needsAuth) {
      const token = await getAccessToken();
      if (!token) {
        return { error: ERROR_MESSAGES.NOT_LOGGED_IN };
      }
      accessToken = token;

      const orgId = await getActiveOrgId();
      if (!skipOrgCheck && !orgId) {
        return { error: ERROR_MESSAGES.NO_ACTIVE_ORG };
      }
      activeOrgId = orgId || undefined;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...(activeOrgId && !skipOrgCheck && { "X-Organization-Id": activeOrgId }),
    };

    const config: RequestInit = {
      method,
      headers,
      cache: "no-store",
      next: tags ? { tags } : undefined,
    };

    if (data && method !== HTTP_METHODS.GET && method !== HTTP_METHODS.DELETE) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${baseUrl}/api${url}`, config);
    const rawResponse = await response.text();

    if (response.headers.get("content-type")?.includes("application/json")) {
      const jsonResponse = JSON.parse(rawResponse);
      if (!response.ok) {
        return jsonResponse;
      }
      return jsonResponse;
    }

    return { error: ERROR_MESSAGES.UNEXPECTED_FORMAT };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

/**
 * Updates a resource using PATCH method
 * @param url - The API endpoint URL
 * @param data - The data to update
 * @param tags - Cache tags for Next.js
 * @returns Promise resolving to the updated resource or error
 */
export async function UPDATE<T>(
  url: string,
  data: T,
  tags?: string[]
): Promise<ApiResponse<T> | null> {
  return makeHttpRequest(url, HTTP_METHODS.PATCH, data, true, false, tags);
}

/**
 * Creates a new resource using POST method
 * @param url - The API endpoint URL
 * @param data - The data to create
 * @param needsAuth - Whether authentication is required
 * @param tags - Cache tags for Next.js
 * @returns Promise resolving to the created resource or error
 */
export async function POST<T>(
  url: string,
  data: T,
  needsAuth: boolean = true,
  tags?: string[]
): Promise<ApiResponse<T> | null> {
  return makeHttpRequest(url, HTTP_METHODS.POST, data, needsAuth, false, tags);
}

/**
 * Retrieves a resource using GET method
 * @param url - The API endpoint URL
 * @param tags - Cache tags for Next.js
 * @param skipOrgCheck - Whether to skip organization check
 * @returns Promise resolving to the resource or error
 */
export async function GET<T>(
  url: string,
  tags?: string[],
  skipOrgCheck: boolean = false
): Promise<ApiResponse<T> | null> {
  return makeHttpRequest(
    url,
    HTTP_METHODS.GET,
    undefined as T,
    true,
    skipOrgCheck,
    tags
  );
}

/**
 * Deletes a resource using DELETE method
 * @param url - The API endpoint URL
 * @param payload - Optional payload for the delete request
 * @param tags - Cache tags for Next.js
 * @returns Promise resolving to the deletion result or error
 */
export async function DELETE<T>(
  url: string,
  payload?: T,
  tags?: string[]
): Promise<ApiResponse<T> | null> {
  return makeHttpRequest(url, HTTP_METHODS.DELETE, payload, true, false, tags);
}

/**
 * Partially updates a resource using PATCH method
 * @param url - The API endpoint URL
 * @param data - The data to update
 * @param tags - Cache tags for Next.js
 * @returns Promise resolving to the updated resource or error
 */
export async function PATCH<T>(
  url: string,
  data: T,
  tags?: string[]
): Promise<ApiResponse<T> | null> {
  return makeHttpRequest(url, HTTP_METHODS.PATCH, data, true, false, tags);
}

/**
 * Updates a resource using PUT method
 * @param url - The API endpoint URL
 * @param data - The data to update
 * @param tags - Cache tags for Next.js
 * @returns Promise resolving to the updated resource or error
 */
export async function PUT<T>(
  url: string,
  data: T,
  tags?: string[]
): Promise<ApiResponse<T> | null> {
  return makeHttpRequest(url, HTTP_METHODS.PUT, data, true, false, tags);
}

"use server";
import { baseUrl } from "./base";
import { cookies } from "next/headers";

function getSupabaseCookieName() {
  const projectRef = process.env
    .NEXT_PUBLIC_SUPABASE_URL!.replace("https://", "")
    .split(".")[0];
  return `sb-${projectRef}-auth-token`;
}

async function getActiveOrgId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("active_org")?.value || null;
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(getSupabaseCookieName())?.value;
  if (!raw) return null;

  const [prefix, b64] = raw.split("-", 2);
  if (prefix !== "base64" || !b64) {
    console.error("Unexpected cookie format:", raw);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sessionObj: any;
  try {
    sessionObj = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  } catch (e) {
    console.error("Failed to decode session cookie", e);
    return null;
  }

  const token = sessionObj?.access_token;

  if (!token) {
    console.error("No access_token found in session cookie:", sessionObj);
    return null;
  }

  return token;
}

export async function UPDATE<T>(
  url: string,
  data: T,
  tags?: string[]
): Promise<T | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      //@ts-expect-error --need to fix this
      return { error: "You are not logged in" };
    }

    const activeOrgId = await getActiveOrgId();
    if (!activeOrgId) {
      //@ts-expect-error --need to fix this
      return { error: "No active organization selected" };
    }

    const response = await fetch(`${baseUrl}/api${url}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Organization-Id": activeOrgId,
      },
      body: JSON.stringify(data),
      cache: "no-store",
      next: tags ? { tags } : undefined,
    });
    const rawResponse = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
      const jsonResponse = JSON.parse(rawResponse);
      if (!response.ok) {
        return jsonResponse;
      }
      return jsonResponse;
    }

    // @ts-expect-error --need to fix this
    return "Unexpected response format";
  } catch (error) {
    console.error("UPDATE request failed:", error);
    return null;
  }
}

export async function POST<T>(
  url: string,
  data: T,
  needsAuth: boolean = true,
  tags?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  try {
    let token: string | undefined;
    let activeOrgId: string | undefined;

    if (needsAuth) {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return { error: "You are not logged in" };
      }
      token = accessToken;
      const orgId = await getActiveOrgId();
      if (orgId) {
        activeOrgId = orgId;
      }
    }

    const thisUrl = `${baseUrl}/api${url}`;
    console.log("thisUrl", thisUrl);
    console.log("activeOrgId", activeOrgId);
    const response = await fetch(thisUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(activeOrgId && { "X-Organization-Id": activeOrgId }),
      },
      body: JSON.stringify(data),
      cache: "no-store",
      next: tags ? { tags } : undefined,
    });
    const rawResponse = await response.text();

    // Handle JSON responses
    if (response.headers.get("content-type")?.includes("application/json")) {
      const jsonResponse = JSON.parse(rawResponse);
      if (!response.ok) {
        return jsonResponse;
      }
      return jsonResponse;
    }

    return { error: "Unexpected response format" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function GET<T>(
  url: string,
  tags?: string[],
  skipOrgCheck: boolean = false
): Promise<T | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      //@ts-expect-error --need to fix this
      return { error: "You are not logged in" };
    }

    const activeOrgId = await getActiveOrgId();
    console.log("activeOrgId", activeOrgId);
    console.log("accessToken", accessToken);

    // Only check for active org if skipOrgCheck is false
    if (!skipOrgCheck && !activeOrgId) {
      //@ts-expect-error --need to fix this
      return { error: "No active organization selected" };
    }

    const thisUrl = `${baseUrl}/api${url}`;
    const response = await fetch(thisUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...(activeOrgId &&
          !skipOrgCheck && { "X-Organization-Id": activeOrgId }),
      },
      cache: "no-store",
      next: tags ? { tags } : undefined,
    });
    const rawResponse = await response.text();

    if (response.headers.get("content-type")?.includes("application/json")) {
      const jsonResponse = JSON.parse(rawResponse);
      if (!response.ok) {
        return jsonResponse;
      }
      return jsonResponse;
    }

    // @ts-expect-error --need to fix this
    return "Unexpected response format";
  } catch (error) {
    console.error("GET request failed:", error);
    return null;
  }
}

export async function DELETE<T>(
  url: string,
  data: T,
  tags?: string[]
): Promise<T | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      //@ts-expect-error --need to fix this
      return { error: "You are not logged in" };
    }

    const activeOrgId = await getActiveOrgId();
    if (!activeOrgId) {
      //@ts-expect-error --need to fix this
      return { error: "No active organization selected" };
    }

    const thisUrl = `${baseUrl}/api${url}`;
    const response = await fetch(thisUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Organization-Id": activeOrgId,
      },
      body: JSON.stringify(data),
      cache: "no-store",
      next: tags ? { tags } : undefined,
    });
    const rawResponse = await response.text();

    if (response.headers.get("content-type")?.includes("application/json")) {
      const jsonResponse = JSON.parse(rawResponse);
      if (!response.ok) {
        return jsonResponse;
      }
      return jsonResponse;
    }

    // @ts-expect-error --need to fix this
    return "Unexpected response format";
  } catch (error) {
    console.error("DELETE request failed:", error);
    return null;
  }
}

export async function PATCH<T>(
  url: string,
  data: T,
  tags?: string[]
): Promise<T | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      //@ts-expect-error --need to fix this
      return { error: "You are not logged in" };
    }

    const activeOrgId = await getActiveOrgId();
    if (!activeOrgId) {
      //@ts-expect-error --need to fix this
      return { error: "No active organization selected" };
    }

    const thisUrl = `${baseUrl}/api${url}`;
    const response = await fetch(thisUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Organization-Id": activeOrgId,
      },
      body: JSON.stringify(data),
      cache: "no-store",
      next: tags ? { tags } : undefined,
    });
    const rawResponse = await response.text();

    if (response.headers.get("content-type")?.includes("application/json")) {
      const jsonResponse = JSON.parse(rawResponse);
      if (!response.ok) {
        return jsonResponse;
      }
      return jsonResponse;
    }

    // @ts-expect-error --need to fix this
    return "Unexpected response format";
  } catch (error) {
    console.error("PATCH request failed:", error);
    return null;
  }
}

//PUT request
export async function PUT<T>(
  url: string,
  data: T,
  tags?: string[]
): Promise<T | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      //@ts-expect-error --need to fix this
      return { error: "You are not logged in" };
    }

    const activeOrgId = await getActiveOrgId();
    if (!activeOrgId) {
      //@ts-expect-error --need to fix this
      return { error: "No active organization selected" };
    }

    const thisUrl = `${baseUrl}/api${url}`;
    const response = await fetch(thisUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Organization-Id": activeOrgId,
      },
      body: JSON.stringify(data),
      cache: "no-store",
      next: tags ? { tags } : undefined,
    });
    const rawResponse = await response.text();

    if (response.headers.get("content-type")?.includes("application/json")) {
      const jsonResponse = JSON.parse(rawResponse);
      if (!response.ok) {
        return jsonResponse;
      }
      return jsonResponse;
    }

    // @ts-expect-error --need to fix this
    return "Unexpected response format";
  } catch (error) {
    console.error("PUT request failed:", error);
    return null;
  }
}

// Helper function for fetch calls to restricted endpoints
// Automatically attaches access token to requests and refreshes if expired
export async function authFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const accessToken = localStorage.getItem("token");

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) throw new Error("Unauthorized");
    return fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }

  return response;
}

async function refreshAccessToken(): Promise<string | null> {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (response.ok) {
    const { accessToken } = await response.json();
    localStorage.setItem("token", accessToken);
    return accessToken;
  }

  return null;
}

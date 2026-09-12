const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiRequest(
  path,
  {
    method = "GET",
    body = null,
    token = null,
  } = {}
) {
  const headers = {
    "Content-Type": "application/json",
  };

  const activeToken =
    token || sessionStorage.getItem("token");

  if (activeToken) {
    headers.Authorization = `Bearer ${activeToken}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      method,
      headers,
      body:
        body === null
          ? undefined
          : JSON.stringify(body),
    }
  );

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        (typeof data === "string" ? data : null) ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

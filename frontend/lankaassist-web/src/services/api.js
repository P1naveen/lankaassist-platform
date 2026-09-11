const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

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
      body: body ? JSON.stringify(body) : null,
    }
  );

  const contentType =
    response.headers.get("content-type");

  const data =
    contentType?.includes("application/json")
      ? await response.json()
      : null;

  if (!response.ok) {
    throw new Error(
      data?.message ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, data: any) {
    const message =
      typeof data?.detail === "string"
        ? data.detail
        : data?.detail?.message || "Something went wrong";
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

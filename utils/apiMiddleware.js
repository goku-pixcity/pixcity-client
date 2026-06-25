// const API_BASE_URL = "https://local.api.pix.city:8002";
const API_BASE_URL = "https://192.168.1.249:8002";

function _tokenSecondsLeft(token) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return (payload.exp || 0) - Math.floor(Date.now() / 1000);
  } catch {
    return 0;
  }
}

const REFRESH_THRESHOLD = 5 * 60;
let _inflightRefresh = null;

export async function maybeRefreshToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  const secondsLeft = _tokenSecondsLeft(token);
  if (secondsLeft <= 0 || secondsLeft > REFRESH_THRESHOLD) return;

  if (!_inflightRefresh) {
    _inflightRefresh = fetch(`${API_BASE_URL}/api/client/token/refresh`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.token) localStorage.setItem("authToken", data.token);
      })
      .catch(() => {})
      .finally(() => {
        _inflightRefresh = null;
      });
  }

  return _inflightRefresh;
}

async function handleResponse(response) {
  let data = {};

  data = await response.json();

  if (!response.ok) {
    return {
      data: data || {},
      success: false,
      code: response.status,
    };
  }

  return {
    data,
    success: true,
    code: response.status,
  };
}

// For public endpoints — login, registration (no JWT required)
export async function apiRequest(endpoint, options = {}) {
  try {
    const isFormData = options.body instanceof FormData;

    const defaultHeaders = {
      Accept: "application/json",
    };

    if (!isFormData) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const cleanHeaders = { ...defaultHeaders, ...options.headers };
    if (isFormData) {
      delete cleanHeaders["Content-Type"];
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: cleanHeaders,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("[API] Request failed:", error);
    return {
      data: { message: error.message },
      success: false,
      code: 500,
    };
  }
}

// For protected endpoints — all requests that require JWT
export async function apiRequestWithAuth(endpoint, options = {}) {
  try {
    await maybeRefreshToken();

    const token = localStorage.getItem("authToken");

    const isFormData = options.body instanceof FormData;

    const defaultHeaders = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (!isFormData) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const cleanHeaders = {
      ...defaultHeaders,
      ...options.headers,
    };

    if (isFormData) {
      delete cleanHeaders["Content-Type"];
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: cleanHeaders,
    });

    if (response.status === 401) {
      localStorage.removeItem("authToken");

      const currentPath = window.location.pathname + window.location.search;

      if (!window.location.pathname.startsWith("/login")) {
        const callbackUrl = encodeURIComponent(currentPath);

        window.location.href = `/login?callbackUrl=${callbackUrl}`;
      }

      return;
    }

    const data = await handleResponse(response);

    if (!data?.success) {
      throw new Error(data?.data?.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("[API] Authenticated request failed:", error);

    throw error;
  }
}

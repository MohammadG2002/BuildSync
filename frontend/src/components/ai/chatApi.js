export function getApiBase() {
  return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
}

export async function fetchSessions() {
  const resp = await fetch(`${getApiBase()}/chat/sessions`);
  const data = await resp.json();
  return data.sessions || [];
}

export async function fetchLogs(sessionId) {
  const resp = await fetch(`${getApiBase()}/chat/logs/${sessionId}`);
  const data = await resp.json();
  return data.logs || [];
}

export async function sendMessage(message, sessionId) {
  const resp = await fetch(`${getApiBase()}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });
  const data = await resp.json().catch(() => ({}));
  return { ok: resp.ok, data };
}

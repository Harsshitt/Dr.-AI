export const API_BASE_URL = import.meta.env.PROD ? "" : "http://localhost:5001";

export async function sendToAI(payload) {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}
import { RUNTIME_CONFIG } from "../configs/runtime.js";

export async function sendLeadWebhook(payload) {
  if (!RUNTIME_CONFIG.SEND_WEBHOOK_ON_SUBMIT) return { ok: true, skipped: true };
  if (!RUNTIME_CONFIG.WEBHOOK_URL) return { ok: false, skipped: true, message: "Ingen webhook-URL sat." };

  try {
    const response = await fetch(RUNTIME_CONFIG.WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return {
      ok: response.ok,
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Ukendt fejl",
    };
  }
}

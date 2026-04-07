// Kultforge Cloudflare Worker
// ─────────────────────────────────────────────────────────────────────────────
// THIS FILE IS FOR REFERENCE ONLY. The Worker is already live at:
//   https://sparkling-recipe-1606.kultforge.workers.dev/
//
// Do NOT deploy this file — it would overwrite the live Worker.
// To make changes, edit directly in the Cloudflare Dashboard → Workers.
// ─────────────────────────────────────────────────────────────────────────────

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body = await request.json();

      const response = await fetch(ANTHROPIC_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADERS,
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: { message: err.message } }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADERS,
        },
      });
    }
  },
};

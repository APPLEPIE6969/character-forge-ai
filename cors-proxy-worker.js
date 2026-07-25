// Cloudflare Worker CORS Proxy for OpenCode Zen
// Deploy at: https://dash.cloudflare.com/workers-and-pages

export default {
  async fetch(request, env, ctx) {
    // Only allow POST to OpenCode Zen
    const url = new URL(request.url);
    const targetUrl = "https://opencode.ai/zen/v1/chat/completions";
    
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return handleCORS();
    }
    
    // Only allow POST
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, ...corsHeaders() });
    }
    
    // Forward the request
    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: await request.text(),
      });
      
      // Return response with CORS headers
      const data = await response.arrayBuffer();
      return new Response(data, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(),
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
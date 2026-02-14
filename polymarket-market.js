export default async function handler(req, res) {
  // Handle preflight (optional but safe)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  const upstream = new URL("https://gamma-api.polymarket.com/markets");

  // Pass through any query params your frontend sends
  for (const [k, v] of Object.entries(req.query || {})) {
    if (Array.isArray(v)) upstream.searchParams.set(k, v[0]);
    else if (v != null) upstream.searchParams.set(k, String(v));
  }

  const r = await fetch(upstream.toString(), {
    headers: { accept: "application/json" },
  });

  const text = await r.text();

  // Allow your static frontend to call this endpoint
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  res.status(r.status).send(text);
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-admin-password",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const TABLE = "bike_listings";

function json(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || "",
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  };
}

function requireAdmin(event) {
  const expectedPassword = process.env.ADMIN_PASSWORD || process.env.REACT_APP_ADMIN_PASSWORD || "";
  const providedPassword = event.headers["x-admin-password"] || event.headers["X-Admin-Password"] || "";
  return Boolean(expectedPassword && providedPassword === expectedPassword);
}

async function supabaseRequest(path, options = {}) {
  const { url, serviceKey } = getSupabaseConfig();
  if (!url || !serviceKey) {
    throw new Error("Supabase is not configured");
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = body?.message || body?.error || `Supabase request failed with ${response.status}`;
    throw new Error(message);
  }
  return body;
}

function normalizeBike(bike, index) {
  return {
    id: Number.isFinite(Number(bike.id)) ? Number(bike.id) : index,
    name: typeof bike.name === "string" ? bike.name.trim() : "",
    images: Array.isArray(bike.images) ? bike.images.filter((src) => typeof src === "string" && src) : [],
    price: parseInt(bike.price, 10) || 0,
  };
}

function normalizeBikes(bikes) {
  const usedIds = new Set();
  return (Array.isArray(bikes) ? bikes : [])
    .map(normalizeBike)
    .filter((bike) => bike.name && bike.images.length > 0)
    .map((bike, index) => {
      let id = bike.id;
      while (usedIds.has(id)) {
        id += 1;
      }
      usedIds.add(id);
      return { ...bike, id: Number.isFinite(id) ? id : index };
    });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    if (event.httpMethod === "GET") {
      const rows = await supabaseRequest(`${TABLE}?select=id,name,images,price&order=created_at.asc`);
      return json(200, { bikes: rows || [] });
    }

    if (event.httpMethod === "POST") {
      if (!requireAdmin(event)) {
        return json(401, { error: "Unauthorized" });
      }

      let body;
      try {
        body = JSON.parse(event.body || "{}");
      } catch (err) {
        return json(400, { error: "Invalid JSON body" });
      }

      const bikes = normalizeBikes(body.bikes);
      await supabaseRequest(`${TABLE}?id=not.is.null`, { method: "DELETE" });

      if (bikes.length > 0) {
        await supabaseRequest(TABLE, {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify(bikes),
        });
      }

      return json(200, { bikes });
    }

    return json(405, { error: "Method not allowed" });
  } catch (err) {
    return json(500, { error: err.message || "Unexpected server error" });
  }
};

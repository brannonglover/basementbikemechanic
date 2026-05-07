const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || process.env.REACT_APP_ADMIN_PASSWORD || "";
  if (!expectedPassword) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Admin password is not configured" }) };
  }

  let password = "";
  try {
    password = JSON.parse(event.body || "{}").password || "";
  } catch (err) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  if (password !== expectedPassword) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Incorrect password" }) };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};

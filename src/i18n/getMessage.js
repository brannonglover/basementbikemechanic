export function getMessage(messages, key) {
  if (!key) return "";
  const parts = key.split(".");
  let value = messages;
  for (const part of parts) {
    if (value == null || typeof value !== "object") return key;
    value = value[part];
  }
  return value ?? key;
}

export function interpolate(template, vars = {}) {
  if (typeof template !== "string") return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) =>
    vars[name] != null ? String(vars[name]) : `{{${name}}}`
  );
}

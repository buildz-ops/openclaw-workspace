const SENSITIVE_KEY = /(token|secret|api[_-]?key|password)/i;

export function sanitizeProviderUrl(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/:\/\/([^@\s]+)@/, "://***@");
}

export function redactSensitiveKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSensitiveKeys);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const obj = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(obj)) {
    if (SENSITIVE_KEY.test(key)) {
      output[key] = "[REDACTED]";
      continue;
    }
    output[key] = redactSensitiveKeys(val);
  }

  return output;
}

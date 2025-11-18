export function sanitize(value: any): any {
  if (typeof value === "string") {
    return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (typeof value === "object" && value !== null) {
    const sanitizedObj: { [key: string]: any } = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        sanitizedObj[key] = sanitize(value[key]);
      }
    }
    return sanitizedObj;
  }

  return value;
}

export type JwtSession = {
  userId: string;
  email: string;
  role: string;
  exp: number;
};

export function decodeJwt(token: string): JwtSession | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf-8")
    );
    if (!payload.userId || !payload.role || typeof payload.exp !== "number") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  return !decoded || Date.now() >= decoded.exp * 1000;
}

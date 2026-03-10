import { SignJWT, jwtVerify } from 'jose'

function getSecret() {
  const raw = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  const fallback = process.env.NODE_ENV === 'production' ? undefined : 'dev-only-change-this-secret'
  const secret = raw || fallback

  if (!secret) throw new Error('JWT_SECRET (or NEXTAUTH_SECRET/AUTH_SECRET) is not set')
  return new TextEncoder().encode(secret)
}

export type AuthTokenPayload = {
  sub: string
  role: 'admin' | 'store' | 'viewer'
  username: string
}

export async function signToken(payload: AuthTokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(getSecret())
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret())
  return payload as unknown as AuthTokenPayload
}

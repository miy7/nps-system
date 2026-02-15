import { prisma } from '@/prisma/db'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (!user) {
    return Response.json({ success: false, message: 'User not found' })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return Response.json({ success: false, message: 'Wrong password' })
  }

  const token = await new SignJWT({
    id: user.id,
    role: user.role,
    name: user.name
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))

  return new Response(
    JSON.stringify({ success: true }),
    {
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=86400`
      }
    }
  )
}

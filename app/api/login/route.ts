import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return NextResponse.json({ error: 'Wrong password' }, { status: 401 })

  const token = await signToken({
    id: user.id,
    role: user.role,
    name: user.name
  })

  const res = NextResponse.json({ success: true })
  res.cookies.set('token', token, { httpOnly: true })
  return res
}

export async function GET() {
  return new Response("NextAuth disabled. Use /api/auth/login", { status: 410 });
}

export async function POST() {
  return new Response("NextAuth disabled. Use /api/auth/login", { status: 410 });
}
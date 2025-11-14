import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  cookies().set('admin-session', '', { maxAge: 0, path: '/' });
  return NextResponse.json({ success: true, message: 'Session terminated' });
}
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, createUser } from '@/lib/db';
import { signToken, createAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = {
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    createUser(user);

    const token = signToken({ id: user.id, email: user.email });
    const cookie = createAuthCookie(token);

    const response = NextResponse.json({
      message: 'Account created successfully',
      user: { id: user.id, name: user.name, email: user.email },
    }, { status: 201 });

    response.cookies.set(cookie);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getUserById } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'realestate-super-secret-key-change-in-production';
const TOKEN_NAME = 'auth_token';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;
    
    const decoded = verifyToken(token);
    if (!decoded) return null;
    
    const user = getUserById(decoded.id);
    if (!user) return null;
    
    const { password, ...safeUser } = user;
    return safeUser;
  } catch {
    return null;
  }
}

export function createAuthCookie(token) {
  return {
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}

export function clearAuthCookie() {
  return {
    name: TOKEN_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  };
}

//EXEMPELKOD

/*import { NextResponse } from 'next/server';
import { verifyJWT } from '../../../../utils/jwt'; // Använd verifyJWT-metoden
import prisma from '../../../../utils/prisma';

export async function GET(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Hämta token från Authorization-header

  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }

  try {
    // Verifiera JWT-token
    const payload = await verifyJWT(token);

    // Gör något med payload, t.ex. hämta användardata eller items
    const items = await prisma.item.findMany({
      where: { userId: payload.userId },
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}*/
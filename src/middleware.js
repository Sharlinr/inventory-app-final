import { NextResponse } from "next/server";
import { verifyJWT } from "./utils/helpers/authHelpers";

export async function middleware(req) {
  const { pathname } = req.nextUrl; // Hämta den aktuella sökvägen

  // Skyddade rutter - Lägg till alla rutter du vill skydda
  const protectedRoutes = ['/items/create', '/items/[id]/edit', '/api/items'];

  // Kontrollera om den aktuella sökvägen matchar en skyddad rutt
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Om det är en skyddad rutt, verifiera JWT-token
  if (isProtectedRoute && req.method !== "GET") {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    // Om ingen token finns, omdirigera till login-sidan
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Verifiera token
    const user = await verifyJWT(token);

    // Om token är ogiltig, omdirigera till login-sidan
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Om token är giltig, låt begäran fortsätta
    return NextResponse.next();
  }

  // Om det inte är en skyddad rutt, låt begäran fortsätta
  return NextResponse.next();
}

// Definiera vilka rutter som middleware ska användas på
export const config = {
  matcher: [
    "/items/:path*", // Skydda alla rutter som börjar med /items
    "/api/items/:path*", // Skydda alla rutter som börjar med /api/items
  ],
};
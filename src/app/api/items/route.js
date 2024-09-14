import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { validateItemData } from "@/utils/helpers/apiHelpers";
import { verifyJWT } from "@/utils/helpers/authHelpers";

const prisma = new PrismaClient();

export async function GET() {
try {
    const items = await prisma.item.findMany();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/*const url = new URL(req.url);
const search = url.searchParams.get("search");
let items = [];
  if (search) {
    items = await prisma.item.findMany({
        where: {
            id: {
                contains: search,
                mode: 'insensitive',
            }
        }
    })
  } else {
    items = await prisma.item.findMany();
  }

  return NextResponse.json(items);
}*/

export async function POST(req) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  
  console.log("Received token:", token);

  const user = await verifyJWT(token);

  if (!user) {
    console.log("Unauthorized - No valid token found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, quantity, category } = await req.json();

    // Validate
    if (!name || !description || !quantity || !category) {
      console.log("Missing fields in request body");
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    console.log("Creating new item with data:", { name, description, quantity, category });

    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        quantity: parseInt(quantity),
        category
      },
    });

    console.log("Item created:", newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


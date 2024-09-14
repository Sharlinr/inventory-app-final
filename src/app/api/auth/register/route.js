import { NextResponse } from "next/server";
import { signJWT } from "@/utils/helpers/authHelpers";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

export async function POST(req) {
    const { name, email, password} = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ message: 'All fields required'}, { status: 400});
    }

    const existingUser = await prisma.user.findUnique({ where: { email }});
    if (existingUser) {
        return NextResponse.json({ message: "User already exists"}, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
}

    const token = signJWT({ userId: newUser.id });
    return NextResponse.json({ message: 'User created',
        user:{ name: newUser.name, email: newUser.email },
        token: token,
    }, { status: 201 });

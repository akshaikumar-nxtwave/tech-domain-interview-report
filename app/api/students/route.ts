import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { mobile, isAdmin } = await request.json();

    if (!mobile) {
      return NextResponse.json(
        { message: "Mobile is required" },
        { status: 400 }
      );
    }

    if (isAdmin) {
      const res = NextResponse.json({ admin: true }, { status: 200 });
      res.cookies.set("session", mobile, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      return res;
    }

    const student = await prisma.candidate_interviews.findFirst({
      where: { mobile_number: mobile },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    const res = NextResponse.json(student, { status: 200 });
    res.cookies.set("session", mobile, {
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: "strict",
      path: "/",
    });
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const adminData = await prisma.candidate_interviews.findMany()
    return NextResponse.json(adminData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: `Server error ${error}` }, { status: 500 })
  }
}

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
//   const {id} = await context.params;
//   const data = await req.json();
  

//   const updated = await prisma.candidate_interviews.update({
//     where: { user_id: id },
//     data,
//   });

//   return NextResponse.json(updated);
// }

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await req.json();

  const existing = await prisma.candidate_interviews.findUnique({
    where: { user_id: id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  if (data.strongest_skill) {
    const incomingSkills = data.strongest_skill
      .split(",")
      .map((s: string) => s.trim().toLowerCase())
      .filter(Boolean);

    const existingSkills = existing.strongest_skill
      ? existing.strongest_skill
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const mergedSkills = Array.from(new Set([...existingSkills, ...incomingSkills]));

    data.strongest_skill = mergedSkills
      .map(
        (s) => s.charAt(0).toUpperCase() + s.slice(1) 
      )
      .join(", ");
  }

  const updated = await prisma.candidate_interviews.update({
    where: { user_id: id },
    data,
  });

  return NextResponse.json(updated);
}

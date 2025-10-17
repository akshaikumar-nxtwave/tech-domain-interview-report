import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newCandidate = await prisma.candidate_interviews.create({
      data: {
        user_id: data.user_id,
        candidate_name: data.candidate_name,
        mobile_number: data.mobile_number,
        candidate_email: data.candidate_email,
        candidate_resume_link: data.candidate_resume_link,
        placement_status: data.placement_status,
        frontend_interview_date: data.frontend_interview_date
          ? new Date(data.frontend_interview_date)
          : null,
        frontend_time_slot: data.frontend_time_slot,
        backend_interview_date: data.backend_interview_date
          ? new Date(data.backend_interview_date)
          : null,
        backend_time_slot: data.backend_time_slot,
        interview_status: data.interview_status,
        meeting_link: data.meeting_link,
      },
    });

    return NextResponse.json(newCandidate, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeNote } from "@/lib/notes-api";
import { isNoteValid } from "@/types/note";

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(notes.map(serializeNote));
  } catch (error) {
    console.error("GET /api/notes failed:", error);
    return NextResponse.json({ error: "Failed to load notes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isNoteValid(body)) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const note = await prisma.note.create({
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
      },
    });

    return NextResponse.json(serializeNote(note), { status: 201 });
  } catch (error) {
    console.error("POST /api/notes failed:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}

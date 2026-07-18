import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeNote } from "@/lib/notes-api";
import { requireUserId } from "@/lib/session";
import { isNoteValid } from "@/types/note";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!isNoteValid(body)) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const existing = await prisma.note.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const note = await prisma.note.update({
      where: { id },
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
      },
    });

    return NextResponse.json(serializeNote(note));
  } catch (error) {
    console.error("PUT /api/notes/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.note.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/notes/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}

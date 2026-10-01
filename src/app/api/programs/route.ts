import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { programs } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/require-user";

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Program name is required." },
        { status: 400 },
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Program name is too long." },
        { status: 400 },
      );
    }

    const [program] = await db
      .insert(programs)
      .values({
        creatorId: user.id,
        name,
        description: description || null,
      })
      .returning({
        id: programs.id,
      });

    return NextResponse.json(program, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create program." },
      { status: 500 },
    );
  }
}
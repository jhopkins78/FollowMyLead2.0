import { NextResponse } from 'next/server';
import prisma from '@/frontend/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/frontend/src/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content } = body;

    const note = await prisma.leadNote.create({
      data: {
        content,
        leadId: params.id,
        createdBy: session.user.email || 'Unknown',
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

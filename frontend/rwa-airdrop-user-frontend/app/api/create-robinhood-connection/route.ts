import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, walletAddress } = await request.json();

    // Check if an entry already exists
    const existingRegistry = await prisma.userRegistry.findFirst({
      where: {
        userId: userId,
        walletaddress: walletAddress,
      },
    });

    if (existingRegistry) {
      // Update existing entry
      const updatedRegistry = await prisma.userRegistry.update({
        where: {
          id: existingRegistry.id,
        },
        data: {
          isActive: true,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(updatedRegistry);
    } else {
      // Create new entry
      const newRegistry = await prisma.userRegistry.create({
        data: {
          userId: userId,
          walletaddress: walletAddress,
          isActive: true,
        },
      });

      return NextResponse.json(newRegistry);
    }
  } catch (error) {
    console.error('Error registering Robinhood connection:', error);
    return NextResponse.json(
      { error: 'Failed to register Robinhood connection' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema for validation
const transactionSchema = z.object({
    amount: z.number().positive(),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    description: z.string().optional(),
    categoryId: z.string().optional(),
});

export async function GET(req: NextRequest) {
    // In real app, get userId from session
    // const session = await auth();
    const userId = 'demo-user-123';

    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        const whereClause: any = { userId };
        if (type) whereClause.type = type;

        const transactions = await prisma.transaction.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
            take: 20
        });

        return NextResponse.json({ data: transactions });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // Mock User
    const userId = 'demo-user-123';

    try {
        const body = await req.json();
        const validation = transactionSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
        }

        const transaction = await prisma.transaction.create({
            data: {
                amount: validation.data.amount,
                type: validation.data.type as any, // Cast enum to match Prisma
                description: validation.data.description,
                categoryId: validation.data.categoryId,
                userId
            }
        });

        return NextResponse.json({ data: transaction }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

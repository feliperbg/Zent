'use server'

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const createTransactionSchema = z.object({
    amount: z.number().positive(),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    description: z.string().optional(),
    userId: z.string(), // In real app, get from session
});

export async function createTransaction(formData: FormData) {
    // Mock auth check - in real app use NextAuth session
    const userId = formData.get('userId') as string;
    if (!userId) {
        return { success: false, error: 'Unauthorized' };
    }

    const rawData = {
        amount: parseFloat(formData.get('amount') as string),
        type: formData.get('type'),
        description: formData.get('description'),
        userId,
    };

    const validation = createTransactionSchema.safeParse(rawData);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    try {
        await prisma.transaction.create({
            data: {
                amount: validation.data.amount,
                type: validation.data.type as any,
                description: validation.data.description,
                userId: validation.data.userId
            }
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Database error' };
    }
}

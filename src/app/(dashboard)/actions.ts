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


    // Keyword-based auto-categorization
    let categoryId = undefined;
    const suggestedCategory = formData.get('suggestedCategory') as string | null;

    if (suggestedCategory) {
        // Try to find the category suggested by Geo Context
        const cat = await prisma.category.findFirst({
            where: { name: { equals: suggestedCategory, mode: 'insensitive' } }
        });
        if (cat) {
            categoryId = cat.id;
        }
    }

    // Fallback to keyword matching if no suggested category or not found (and description exists)
    if (!categoryId && validation.data.description) {
        const description = validation.data.description.toLowerCase();
        // Determine category based on keywords
        // This is a simplified version, in a real app this would query the DB for keywords or use an AI service
        // For now we will try to find existing categories that match common terms
        const categories = await prisma.category.findMany();

        const matchedCategory = categories.find(cat => {
            const catName = cat.name.toLowerCase();
            // Check if category name is in description or vice versa
            return description.includes(catName) || catName.includes(description);
        });

        if (matchedCategory) {
            categoryId = matchedCategory.id;
        }
    }

    try {
        await prisma.transaction.create({
            data: {
                amount: validation.data.amount,
                type: validation.data.type as any,
                description: validation.data.description,
                userId: validation.data.userId,
                categoryId: categoryId
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/transactions');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Database error' };
    }
}

const createFixedExpenseSchema = z.object({
    description: z.string().min(1),
    amount: z.number().positive(),
    day: z.number().min(1).max(31),
    type: z.enum(['INCOME', 'EXPENSE']),
    userId: z.string(),
});

export async function createFixedExpense(formData: FormData) {
    const userId = formData.get('userId') as string;
    if (!userId) {
        return { success: false, error: 'Unauthorized' };
    }

    const rawData = {
        description: formData.get('description'),
        amount: parseFloat(formData.get('amount') as string),
        day: parseInt(formData.get('day') as string),
        type: formData.get('type'),
        userId,
    };

    const validation = createFixedExpenseSchema.safeParse(rawData);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    try {
        await prisma.fixedExpense.create({
            data: {
                description: validation.data.description,
                amount: validation.data.amount,
                day: validation.data.day,
                type: validation.data.type as any,
                userId: validation.data.userId,
            }
        });

        revalidatePath('/transactions');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Database error' };
    }
}

export async function getFixedExpenses(userId: string) {
    if (!userId) return [];

    try {
        return await prisma.fixedExpense.findMany({
            where: { userId },
            orderBy: { day: 'asc' }
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function deleteFixedExpense(id: string, userId: string) {
    if (!userId) return { success: false, error: 'Unauthorized' };

    try {
        // Verify ownership
        const expense = await prisma.fixedExpense.findUnique({
            where: { id }
        });

        if (!expense || expense.userId !== userId) {
            return { success: false, error: 'Not found or unauthorized' };
        }

        await prisma.fixedExpense.delete({
            where: { id }
        });

        revalidatePath('/transactions');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Database error' };
    }
}

export async function getTransactions(userId: string) {
    if (!userId) return [];

    try {
        return await prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            include: { category: true }
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

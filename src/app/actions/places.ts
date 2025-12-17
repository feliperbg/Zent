'use server';

import prisma from '@/lib/prisma';
import { PlaceType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function addSavedPlace(userId: string, data: { name: string, type: PlaceType, latitude: number, longitude: number }) {
    if (!userId) return { success: false, error: 'Unauthorized' };

    try {
        await prisma.place.create({
            data: {
                userId,
                name: data.name,
                type: data.type,
                latitude: data.latitude,
                longitude: data.longitude
            }
        });

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Add Place Error:', error);
        return { success: false, error: 'Database error' };
    }
}

export async function deleteSavedPlace(placeId: string, userId: string) {
    if (!userId) return { success: false, error: 'Unauthorized' };

    try {
        const place = await prisma.place.findUnique({ where: { id: placeId } });
        if (!place || place.userId !== userId) {
            return { success: false, error: 'Not found or unauthorized' };
        }

        await prisma.place.delete({ where: { id: placeId } });

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Delete Place Error:', error);
        return { success: false, error: 'Database error' };
    }
}

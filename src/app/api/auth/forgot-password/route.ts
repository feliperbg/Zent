import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Even if user not found, return success to prevent enumeration
        if (!user) {
            return NextResponse.json({ success: true });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        // Save to DB
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires,
            },
        });

        // Mock Email Sending (Log to console)
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        console.log(`
        ===========================================
        [MOCK EMAIL SERVICE]
        To: ${email}
        Subject: Recuperação de Senha - Zent
        
        Olá,
        Você solicitou a redefinição de sua senha.
        Clique no link abaixo:
        ${resetUrl}
        ===========================================
        `);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

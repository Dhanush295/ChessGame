import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createSession({ userId }: { userId: number }) {
    const session = await prisma.sessions.create({
        data: {
            authorId: userId,
        },
    });
    return session;
}
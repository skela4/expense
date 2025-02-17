"use server"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

async function getUserBalance():Promise<{
    balance?: number;
    error?: string;
}> {
    const {userId} = await auth();

    if (!userId) {
        return {error: 'User not found'}
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: {authorId: userId}
        });
        const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        return {balance};
    } catch (error) {
        return {error: 'Database error'};
    }
}

export default getUserBalance;
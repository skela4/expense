"use server"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

async function getIncomeExpense():Promise<{
    income?: number;
    expense?: number
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
        const amounts = transactions.map((transaction) => transaction.amount);
        const income = amounts
            .filter((amount) => amount > 0)
            .reduce((acc, item) => acc + item, 0);

        const expense = amounts
            .filter((amount) => amount < 0)
            .reduce((acc, item) => acc + item, 0);

        return {income, expense: Math.abs(expense)};
    } catch (error) {
        return {error: 'Database error'};
    }
}

export default getIncomeExpense;
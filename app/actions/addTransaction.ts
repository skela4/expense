"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

interface TransactionData {
    text: string;
    amount: number;
}

interface TransactionResult {
    data?: TransactionData;
    error?: string;
}

const addTransaction = async (formData: FormData): Promise<TransactionResult> => {
    const textValue = formData.get("text")
    const amountValue = formData.get("amount")

    // check for input values
    if (!textValue || textValue === '' || !amountValue ) {
        return {error: 'Text or amount is missing'};
    }

    const text:  string = textValue.toString(); // Ensure text is a string
    const amount:  number = parseFloat(amountValue.toString()); // Parse amount as number

    // get logged in user
    const { userId } = await auth()

    if (!userId) {
        return {error: 'User not found'}
    }

    try {
        const transactionData: TransactionData = await prisma.transaction.create({
            data: {
                text,
                amount,
                authorId: userId
            }
        })
        revalidatePath('/');

        return { data: transactionData };
    } catch (error) {
        return { error: 'Transaction not added' };
    }
}

export default addTransaction;
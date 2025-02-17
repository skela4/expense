export interface Transaction {
    id: string;
    text: string;
    amount: number;
    authorId: string;
    createdAt: Date;
}
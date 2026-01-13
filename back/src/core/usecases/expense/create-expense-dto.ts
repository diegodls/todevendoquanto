import { ExpenseStatusType } from "@/core/entities/expense/expense";

export type CreateExpenseBodyInput = {
  name: string;
  description?: string;
  amount?: string;
  totalAmount?: string;
  status?: string;
  tags?: string[];
  currentInstallment?: number;
  totalInstallment?: number;
  paymentDay?: string;
  expirationDay?: string;
  paymentStartAt?: string;
  paymentEndAt?: string;
};

export type CreateExpenseInputDTO = {
  name: string;
  description: string;
  amount: number;
  totalAmount: number;
  status: ExpenseStatusType;
  tags: string[];
  currentInstallment: number;
  totalInstallment: number;
  paymentDay: Date;
  expirationDay: Date;
  paymentStartAt: Date;
  paymentEndAt: Date;
};

export type CreateExpenseOutputDTO = {
  name: string;
  description: string;
  amount: number;
  currency: string;
  totalAmount: number;
  status: string;
  tags: string[];
  currentInstallment: number;
  totalInstallment: number;
  paymentDay: string;
  expirationDay: string;
  paymentStartAt: string;
  paymentEndAt: string;
};

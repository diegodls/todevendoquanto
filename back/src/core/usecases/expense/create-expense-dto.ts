import { Expense, UserExpenseValidProps } from "@/core/entities/expense";

export type CreateExpenseBodyInput = {
  name: string;
  description?: string;
  amount?: string;
  totalAmount?: string;
  status?: string;
  tags?: string[];
  actualInstallment?: number;
  totalInstallment?: number;
  paymentDay?: string;
  expirationDay?: string;
  paymentStartAt?: string;
  paymentEndAt?: string;
};

export type CreateExpenseInputDTO = UserExpenseValidProps;

export type CreateExpenseOutputDTO = Expense[];

export type CreateExpenseUseCaseInput = {
  userId: Expense["userId"];
  expense: CreateExpenseInputDTO;
};

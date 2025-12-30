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
  paymentDay?: Date;
  expirationDay?: Date;
  paymentStartAt?: Date;
  paymentEndAt?: Date;
};

export type CreateExpenseInputDTO = UserExpenseValidProps;

export type CreateExpenseOutputDTO = Expense[];

export type CreateExpenseUseCaseInput = {
  userId: Expense["userId"];
  expense: CreateExpenseInputDTO;
};

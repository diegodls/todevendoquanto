import { Expense, UserExpenseValidProps } from "@/core/entities/expense";

export type CreateExpenseBodyInput = Pick<Expense, "name"> &
  Partial<Omit<UserExpenseValidProps, "userId">>;

export type CreateExpenseOutputDTO = Expense[];

export type CreateExpenseInputDTO = {
  userId: Expense["userId"];
  expense: CreateExpenseBodyInput;
};

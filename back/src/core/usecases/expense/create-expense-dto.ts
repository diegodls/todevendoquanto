import { Expense, UserExpenseValidProps } from "@/core/entities/expense";
import { User } from "@/core/entities/user";

export type CreateExpenseInputDTO = Pick<Expense, "name"> &
  Partial<UserExpenseValidProps>;

export type CreateExpenseOutputDTO = Expense[];

export type CreateExpenseUseCaseProps = {
  userId: User["id"];
  expense: CreateExpenseInputDTO;
};

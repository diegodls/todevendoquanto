import { Expense } from "@/core/entities/expense";
import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export type DeleteExpenseInputDTO = {
  id: Expense["id"];
};

export type DeleteExpenseParamsInput = PropsToString<DeleteExpenseInputDTO>;

export type DeleteExpenseOutputDTO = {};

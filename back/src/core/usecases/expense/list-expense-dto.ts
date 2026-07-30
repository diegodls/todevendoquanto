import {
  PaginatedResponse,
  PaginationRequestProps,
} from '@/application/dtos/shared/pagination-dto';
import { ExpenseDescription } from '@/core/entities/expense/value-objects/expense-description';
import { ExpenseName } from '@/core/entities/expense/value-objects/expense-name';
import { InstallmentId } from '@/core/entities/expense/value-objects/installment-id';
import { Money } from '@/core/entities/expense/value-objects/money';
import { UserId } from '@/core/entities/user/value-objects/user-id';
import {
  PropsToStringAssertive,
  PropsToStringOptional,
} from '@/core/shared/types/helpers/props-to-string';

export type ListExpenseRequestDataProps = {
  requestingUserId: UserId;
  targetUserId: UserId;
};

export type ListExpenseFiltersOptionsProps = {
  name?: ExpenseName;
  installmentId?: InstallmentId;
  created_before?: Date;
  created_after?: Date;
  updated_before?: Date;
  updated_after?: Date;
  description?: ExpenseDescription;
  amount_min?: Money;
  amount_max?: Money;
  currency?: string[];

  /*

totalAmount_min
totalAmount_max

status (string[])

tags (string[])

currentInstallment (number[])
totalInstallment (number[])

paymentDay_before
paymentDay_after
expirationDay_before
expirationDay_after
paymentStartAt_before
paymentStartAt_after
paymentEndAt_before
paymentEndAt_after

pagination_fields (page, page_size, etc...)

*/
};

export type ListExpenseRequestDataParams =
  PropsToStringAssertive<ListExpenseRequestDataProps>;

export type ListExpenseFiltersParams =
  PropsToStringOptional<ListExpenseFiltersOptionsProps>;

export type ListExpenseParams = ListExpenseRequestDataParams &
  ListExpenseFiltersParams &
  PaginationRequestProps;

export type ListExpensesInputDTO = ListExpenseRequestDataParams &
  ListExpenseFiltersParams &
  PaginationRequestProps;

export type ListExpenseOutputProps = {
  userId: string;
  installmentId: string;
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

export type ListExpenseOutputDTO = PaginatedResponse<ListExpenseOutputProps>;

import {
  PaginatedResponse,
  PaginationRequestProps,
} from '@/application/dtos/shared/pagination-dto';
import { ExpenseDescription } from '@/core/entities/expense/value-objects/expense-description';
import { ExpenseName } from '@/core/entities/expense/value-objects/expense-name';
import { ExpenseStatus } from '@/core/entities/expense/value-objects/expense-status';
import { InstallmentId } from '@/core/entities/expense/value-objects/installment-id';
import { InstallmentInfo } from '@/core/entities/expense/value-objects/installment-info';
import { Money } from '@/core/entities/expense/value-objects/money';
import { Tags } from '@/core/entities/expense/value-objects/tags';
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
  currency?: string[];
  amount_min?: Money;
  amount_max?: Money;
  totalAmount_min?: Money;
  totalAmount_max?: Money;
  status?: ExpenseStatus[];
  tags?: Tags[];
  currentInstallment?: InstallmentInfo[];
  totalInstallment?: InstallmentInfo[];
  paymentDay_before?: Date;
  paymentDay_after?: Date;
  expirationDay_before?: Date;
  expirationDay_after?: Date;
  paymentStartAt_before?: Date;
  paymentStartAt_after?: Date;
  paymentEndAt_before?: Date;
  paymentEndAt_after?: Date;
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

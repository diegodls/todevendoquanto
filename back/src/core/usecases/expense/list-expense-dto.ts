import {
  PaginatedResponse,
  PaginationRequestProps,
} from '@/application/dtos/shared/pagination-dto';
import { UserId } from '@/core/entities/user/value-objects/user-id';
import {
  PropsToStringAssertive,
  PropsToStringOptional,
} from '@/core/shared/types/helpers/props-to-string';

export type ListExpenseRequestBodyProps = {
  requestingUserId: UserId;
  targetUserId: UserId;
};

export type ListExpenseRequestBodyParams =
  PropsToStringAssertive<ListExpenseRequestBodyProps>;

export type ListExpenseFiltersOptionsProps = {
  name?: string;
  installmentId?: string;
  created_before?: Date;
  created_after?: Date;
  updated_before?: Date;
  updated_after?: Date;
  description?: string;
  currency?: string[];
  amount_min?: number;
  amount_max?: number;
  totalAmount_min?: number;
  totalAmount_max?: number;
  status?: string[];
  tags?: string[];
  currentInstallment?: number;
  totalInstallment?: number;
  paymentDay_before?: Date;
  paymentDay_after?: Date;
  expirationDay_before?: Date;
  expirationDay_after?: Date;
  paymentStartAt_before?: Date;
  paymentStartAt_after?: Date;
  paymentEndAt_before?: Date;
  paymentEndAt_after?: Date;
};

export type ListExpenseFiltersOptionsParams =
  PropsToStringOptional<ListExpenseFiltersOptionsProps>;

export type ListExpenseOrderByOptions = {
  name: string;
  description: string;
  amount: number;
  currency: string;
  totalAmount: number;
  status: string;
  tags: string[];
  currentInstallment: number;
  totalInstallment: number;
  paymentDay: Date;
  expirationDay: Date;
  paymentStartAt: Date;
  paymentEndAt: Date;
};

export type ListExpenseOrderByParams =
  PropsToStringOptional<ListExpenseOrderByOptions>;

export const ListExpenseOrderByOptionsMap: Record<
  keyof ListExpenseOrderByOptions,
  true
> = {
  name: true,
  description: true,
  amount: true,
  currency: true,
  totalAmount: true,
  status: true,
  tags: true,
  currentInstallment: true,
  totalInstallment: true,
  paymentDay: true,
  expirationDay: true,
  paymentStartAt: true,
  paymentEndAt: true,
};

export const ListExpenseOrderByOptionsArrKey = Object.keys(
  ListExpenseOrderByOptionsMap,
) as (keyof ListExpenseOrderByOptions)[];

export const ListExpenseOrderDirectionOptions = ['asc', 'desc'] as const;

export type ListExpenseOrderRequestOptionalOptions = {
  order?: (typeof ListExpenseOrderDirectionOptions)[number];
  orderBy?: keyof PropsToStringAssertive<ListExpenseOrderByOptions>;
};

export type ListExpenseOrderRequestOptions = {
  order: (typeof ListExpenseOrderDirectionOptions)[number];
  orderBy: keyof PropsToStringAssertive<ListExpenseOrderByOptions>;
};

export type ListExpenseOrderRequestOptionsParams =
  PropsToStringAssertive<ListExpenseOrderRequestOptions>;

export type ListExpenseRepositoryDTO = {};

export type ListExpenseInputParams = ListExpenseRequestBodyParams &
  ListExpenseFiltersOptionsParams &
  ListExpenseOrderRequestOptionalOptions &
  PaginationRequestProps;

export type ListExpensesInputDTO = {
  body: ListExpenseRequestBodyParams;
  filters: ListExpenseFiltersOptionsProps;
  sorting: ListExpenseOrderRequestOptionalOptions;
  pagination: PaginationRequestProps;
};

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

/*

userId
installmentId

created_before
created_after
updated_before
updated_after

name (contain)

description (contain)

amount_min
amount_max

currency (string[])

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

import { PaginatedResponse } from '@/application/dtos/shared/pagination-dto';
import { PropsToStringOptional } from '@/core/shared/types/helpers/props-to-string';

export type ListExpenseInput = {};

export type ListExpenseQueryParams = PropsToStringOptional<ListExpenseInput>;

export type ListExpensesInputDTO = {
  requestingUserId: string;
  targetUserId: string;
};

export type ListExpenseOutputProps = {
  userId: string;
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

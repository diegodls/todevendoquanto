import { Bill, UserBillValidProps } from "@/core/entities/bill";
import { User } from "@/core/entities/user";
import { PropsToString } from "@/core/shared/types/helpers/props-to-string";

export type CreateBillProps = Pick<Bill, "name"> & UserBillValidProps;

export type CreateBillInputDTO = PropsToString<CreateBillProps>;

export type CreateBillOutputDTO = Bill;

export type CreateBillUseCaseProps = {
  userId: User["id"];
  bill: CreateBillProps;
};

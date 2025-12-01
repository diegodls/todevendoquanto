import { Bill, UserBillValidProps } from "@/core/entities/bill";
import { User } from "@/core/entities/user";

export type CreateBillInputProps = Pick<Bill, "name"> & UserBillValidProps;

export type CreateBillOutputDTO = Bill;

export type CreateBillInputDTO = {
  userId: User["id"];
  bill: Bill;
};

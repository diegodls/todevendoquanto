import { User } from "@/core/entities/user";

export type DeleteUserByIDInputDTO = {
  id: User["id"];
};

export type DeleteUserByIDOutputDTO = { deletedId: User["id"] };

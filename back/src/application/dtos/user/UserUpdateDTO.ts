import { User, UserValidPropsToChange } from "@/core/domain/User";

type UserUpdateParams = { id: User["id"] };

type UserUpdateInputDTO = UserValidPropsToChange;

type UserUpdateOutputDTO = Omit<User, "password"> | null;

export { UserUpdateInputDTO, UserUpdateOutputDTO, UserUpdateParams };

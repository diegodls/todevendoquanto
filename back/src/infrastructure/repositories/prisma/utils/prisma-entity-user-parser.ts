import { User as PrismaUser } from "../../../../../generated/prisma";
import { User as EntityUser, UserRole } from "../../../../core/entities/user";

export const prismaEntityUserParser = (prismaUser: PrismaUser): EntityUser => {
  const output: EntityUser = {
    ...prismaUser,
    role: UserRole[prismaUser.role],
  };

  return output;
};

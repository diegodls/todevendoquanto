import { UserId } from "@/core/entities/user/value-objects/user-id";
import { User as PrismaUser } from "../../../../../generated/prisma";
import {
  User as EntityUser,
  UserProps,
} from "../../../../core/entities/user/user";

import { Password } from "@/core/entities/user/value-objects/password";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { UserRoleMapper } from "@/infrastructure/repositories/prisma/mappers/user/user-role-mapper";

export const prismaUserEntityParser = (prismaUser: PrismaUser): EntityUser => {
  const userId = UserId.from(prismaUser.id);
  const userName = prismaUser.name;
  const userEmail = Email.create(prismaUser.email);
  const userHashedPassword = Password.create(prismaUser.hashedPassword);
  const userRole = UserRoleMapper.toDomain(prismaUser.role);

  const props: UserProps = {
    id: userId,
    name: userName,
    email: userEmail,
    hashedPassword: userHashedPassword.getValue(),
    role: userRole,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
    isActive: prismaUser.isActive,
  };

  const output = EntityUser.reconstitute(props);

  return output;
};

import { UserRole } from "@/core/entities/user/value-objects/user-role";
import { InvalidUserRoleError } from "@/core/shared/errors/domain";
import { Role as PrismaRole } from "../../../../../generated/prisma";

export class UserRoleMapper {
  public static toPersistence(userRole: UserRole): PrismaRole {
    const value = userRole.toString();

    if (value === "ADMIN") return PrismaRole.ADMIN;
    if (value === "BASIC") return PrismaRole.BASIC;

    throw new InvalidUserRoleError(value, ["ADMIN", "BASIC"]);
  }

  public static toDomain(rawRole: PrismaRole): UserRole {
    return UserRole.create(rawRole);
  }
}

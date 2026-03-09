import { UserRole } from "@/core/entities/user/value-objects/user-role";
import { Role as PrismaRole } from "@/prisma";

export class UserRoleMapper {
  public static toPersistence(userRole: UserRole): PrismaRole {
    const value = userRole.toString();

    if (value === "ADMIN") return PrismaRole.ADMIN;
    if (value === "BASIC") return PrismaRole.BASIC;

    throw new Error(`Role ${value} cannot be mapped to Prisma Role`);
  }

  public static toDomain(rawRole: PrismaRole): UserRole {
    return UserRole.create(rawRole);
  }
}

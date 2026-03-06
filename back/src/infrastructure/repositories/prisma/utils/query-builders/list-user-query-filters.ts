import { ListUsersFiltersOptions } from "@/core/usecases/user/list-user-dto";
import { PrismaGenerated } from "@/infrastructure/repositories/prisma/config/prisma-client";
import { GenericFilterMapper } from "@/infrastructure/repositories/prisma/user-repository-prisma";

export const listUsersFilters: GenericFilterMapper<
  ListUsersFiltersOptions,
  PrismaGenerated.UserWhereInput
> = {
  name: (value: string) => ({
    name: {
      contains: value,
      mode: "insensitive",
    },
  }),
  email: (value: string) => ({
    email: {
      equals: value,
      mode: "insensitive",
    },
  }),
  isActive: (value: boolean) => ({ isActive: value }),
  roles: (value: string[]) => ({
    role: {
      in: value,
    },
  }),
  created_after: (value: Date) => ({
    createdAt: { gte: new Date(value) },
  }),
  created_before: (value: Date) => ({
    createdAt: { lte: new Date(value) },
  }),
  updated_after: (value: Date) => ({
    updatedAt: { gte: new Date(value) },
  }),
  updated_before: (value: Date) => ({
    updatedAt: { lte: new Date(value) },
  }),
};

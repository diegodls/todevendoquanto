import { UserListQueryProps } from "@/application/dtos/admin/user-list-dto";
import { PrismaGenerated } from "@/core/shared/utils/orm/prisma/prisma-client";
import { GenericFilterMapper } from "@/infrastructure/repositories/prisma/utils/map-filter-to-prisma-where";

export const userListFilterMapper: GenericFilterMapper<
  UserListQueryProps,
  PrismaGenerated.UserWhereInput
> = {
  name: (value) => ({
    name: {
      contains: value,
      mode: "insensitive",
    },
  }),
  email: (value) => ({
    email: {
      equals: value,
      mode: "insensitive",
    },
  }),
  is_active: (value) => ({ is_active: value }),
  roles: (value) => ({
    role: {
      in: value,
    },
  }),
  created_after: (value) => ({
    created_at: { gte: new Date(value) },
  }),
  created_before: (value) => ({
    created_at: { lte: new Date(value) },
  }),
  updated_after: (value) => ({
    updated_at: { gte: new Date(value) },
  }),
  updated_before: (value) => ({
    updated_at: { lte: new Date(value) },
  }),
};

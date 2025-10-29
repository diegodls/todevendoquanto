import { UserListQueryProps } from "@/application/dtos/admin/UserListDTO";
import { PrismaGenerated } from "@/core/shared/utils/orm/prisma/prismaClient";

/*
type TFilterMapper = {
  [K in keyof UserListQueryProps]?: (
    value: NonNullable<UserListQueryProps[K]>
  ) => PrismaGenerated.UserWhereInput;
};
*/

type TFilterMapper = {
  [K in keyof UserListQueryProps]?: (
    value: NonNullable<UserListQueryProps[K]>
  ) => PrismaGenerated.UserWhereInput;
};

export const filterMapper: TFilterMapper = {
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
  roles: (value) => ({
    role: {
      in: value,
    },
  }),
  is_active: (value) => ({
    is_active: {
      equals: value,
    },
  }),
};

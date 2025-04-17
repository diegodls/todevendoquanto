export enum UserType {
  "ADMIN",
  "BASIC",
}

export enum Permissions {
  "user-create",
  "user-update",
  "user-delete",
}

export type UserProps = {
  id: string;
  name: string;
  email: string;
  type: UserType;
  permissions: Permissions[];
};

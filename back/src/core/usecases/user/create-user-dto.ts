export type CreateUserInputProps = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export type CreateUserInputDTO = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export type CreateUserOutputDTO = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
};

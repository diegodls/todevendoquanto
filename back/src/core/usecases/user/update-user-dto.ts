export type UpdateUserInputProps = { id: string };

export type UpdateUserInputParams = { id: string };

export type UpdateUserBodyDTO = {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
};

export type UpdateUserInputDTO = {
  requestingUserId: string;
  targetUserId: string;
} & UpdateUserBodyDTO;

export type UpdateUserOutputDTO = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

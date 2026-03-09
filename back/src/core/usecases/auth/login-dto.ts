export type LoginUserPayloadType = {
  email: string;
  role: string;
};
export type LoginUserInputQuery = {
  email: string;
  password: string;
};

export type LoginUserInputDTO = {
  email: string;
  password: string;
};

export type LoginUserOutputDTO = {
  token: string;
};

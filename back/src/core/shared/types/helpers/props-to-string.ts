export type PropsToStringAssertive<T> = {
  [K in keyof T]: string;
};

export type PropsToStringOptional<T> = {
  [K in keyof T]?: string;
};

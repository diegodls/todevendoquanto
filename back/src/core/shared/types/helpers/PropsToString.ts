export type PropsToString<T> = {
  [K in keyof T]: string | undefined;
};

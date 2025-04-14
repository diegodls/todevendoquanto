export interface Api {
  start(port: number): void;
  useErrorMiddleware(): void;
}

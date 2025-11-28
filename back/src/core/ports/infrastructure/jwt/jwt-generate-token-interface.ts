export interface JwtGenerateTokenInterface {
  execute: (
    payload: string | object | Buffer<ArrayBufferLike>,
    subject: string
  ) => string;
}

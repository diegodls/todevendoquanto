export type HttpRequest<B = any, H = any, P = any, Q = any> = {
  body: B;
  headers: H;
  params: P;
  query: Q;
};

export type HttpResponse<T = any> = {
  statusCode: number;
  body: T;
};

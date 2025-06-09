import { HttpMethod } from "../types/HttpMethod";

interface IRoute<T> {
  method: HttpMethod;
  path: `/${string}`;
  handler: T;
}

export { IRoute };

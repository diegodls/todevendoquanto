import { Request } from "express";

export type ExpressCustomRequestBody<T> = Request<{}, {}, T>;

export type ExpressCustomRequestQuery<T> = Request<{}, {}, {}, T>;

import { ApiError } from "@/core/shared/utils/errors/ApiError";

export type TypedError = Error & Partial<ApiError>;

export type TErrorHandler = (error: TypedError) => ApiError;

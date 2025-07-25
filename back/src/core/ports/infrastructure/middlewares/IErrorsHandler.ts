import { ApiError } from "@/core/shared/utils/errors/ApiError";

type TypedError = Error & Partial<ApiError>;

type TErrorHandler = (error: TypedError) => ApiError;

export { TErrorHandler, TypedError };

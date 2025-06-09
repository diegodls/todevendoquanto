import { ApiError } from "../utils/ApiError";

type TypedError = Error & Partial<ApiError>;

type TErrorHandler = (error: TypedError) => ApiError;

export { TypedError as ErrorTyped, TErrorHandler };

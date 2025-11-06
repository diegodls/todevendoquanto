import { ApiError } from "@/core/shared/utils/errors/api-error";

export type ErrorType = Error & Partial<ApiError>;

export type ErrorHandlerType = (error: ErrorType) => ApiError;

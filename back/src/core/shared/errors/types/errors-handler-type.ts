import { ApiError } from "@/core/shared/errors/api-errors";

export type ErrorType = Error & Partial<ApiError>;

export type ErrorHandlerType = (error: ErrorType) => ApiError;

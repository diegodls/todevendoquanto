export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotModifiedError extends ApiError {
  // when a requisition is OK but nothing was modified
  // no need to return/retrieve new/same data
  constructor(message: string) {
    super(message, 304);
  }
}

class ErrorBadRequest extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

class NotAuthenticatedError extends ApiError {
  // not authenticated
  constructor(message: string) {
    super(message, 401);
  }
}

class UnauthorizedError extends ApiError {
  // authenticated, without permissions to do
  constructor(message: string) {
    super(message, 403);
  }
}

class ErrorNotFound extends ApiError {
  constructor(message: string) {
    super(message, 404);
  }
}

class ConflictError extends ApiError {
  // when the db resource don't have the props passed
  // sell: 2, props have 1
  constructor(message: string) {
    super(message, 409);
  }
}

class AlreadyExistError extends ApiError {
  constructor(message: string) {
    super(message, 422);
  }
}

export const CustomApiErrors = {
  NotModifiedError,
  ErrorBadRequest,
  NotAuthenticatedError,
  UnauthorizedError,
  ErrorNotFound,
  ConflictError,
  AlreadyExistError,
};

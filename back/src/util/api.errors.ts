export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ErrorBadRequest extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

class ErrorNotFound extends ApiError {
  constructor(message: string) {
    super(message, 404);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}

class AlreadyExistError extends ApiError {
  constructor(message: string) {
    super(message, 403);
  }
}

class ConflictError extends ApiError {
  // when the db resource don't have the props passed
  // sell: 2, props have 1
  constructor(message: string) {
    super(message, 409);
  }
}

class NotModifiedError extends ApiError {
  // when a requisition is OK but nothing was modified
  // no need to return/retrieve new/same data
  constructor(message: string) {
    super(message, 304);
  }
}

export const CustomApiErrors = {
  ErrorBadRequest,
  ErrorNotFound,
  UnauthorizedError,
  AlreadyExistError,
  ConflictError,
  NotModifiedError,
};

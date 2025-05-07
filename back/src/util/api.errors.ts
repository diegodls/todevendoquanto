export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

class NotModifiedError extends ApiError {
  // when a requisition is OK but nothing was modified
  // no need to return/retrieve new/same data
  constructor(message: string, errors?: Record<string, string>) {
    super(message, 304, errors);
  }
}

class BadRequestError extends ApiError {
  constructor(message: string, errors?: Record<string, string>) {
    super(message, 400, errors);
  }
}

class NotAuthenticatedError extends ApiError {
  // not authenticated
  constructor(message: string, errors?: Record<string, string>) {
    super(message, 401, errors);
  }
}

class UnauthorizedError extends ApiError {
  // authenticated, without permissions to do
  constructor(message: string, errors?: Record<string, string>) {
    super(message, 403, errors);
  }
}

class NotFoundError extends ApiError {
  constructor(message: string, errors?: Record<string, string>) {
    super(message, 404, errors);
  }
}

class ConflictError extends ApiError {
  // when the db resource don't have the props passed
  // sell: 2, props have 1
  constructor(message: string, errors?: Record<string, string>) {
    super(message, 409, errors);
  }
}

class AlreadyExistError extends ApiError {
  constructor(message: string, errors?: Record<string, string>) {
    super(message, 422, errors);
  }
}

class InternalError extends ApiError {
  constructor(message: string, errors?: Record<string, string>) {
    super(message, 500, errors);
  }
}

export const CustomApiErrors = {
  NotModifiedError,
  BadRequestError,
  NotAuthenticatedError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  AlreadyExistError,
  InternalError,
};

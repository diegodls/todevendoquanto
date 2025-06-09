export class ApiError extends Error {
  public readonly status: number;
  public readonly errors?: Record<string, string>[];
  public readonly code?: string;
  public readonly timestamp?: string;
  // ! VERIFICAR SE O ZOD ESTÁ RETORNANDO OS ERROS COMO "Record<string, string>[];"
  // ! TROCAR OU FAZER UM ADAPTER PARA O ZOD RETORNAR OS ERROS COMO "Record<string, string>[];"

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string>[],
    code?: string,
    timestamp?: string
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.code = code;
    this.timestamp = timestamp;
  }
}

class NotModifiedError extends ApiError {
  // when a requisition is OK but nothing was modified
  // no need to return/retrieve new/same data
  constructor(
    message: string,
    errors?: Record<string, string>[],
    code?: string,
    timestamp?: string
  ) {
    super(message, 304, errors, code, timestamp);
  }
}

class BadRequestError extends ApiError {
  constructor(
    message: string,
    errors?: Record<string, string>[],
    code?: string,
    timestamp?: string
  ) {
    super(message, 400, errors, code, timestamp);
  }
}

class NotAuthenticatedError extends ApiError {
  // not authenticated
  constructor(
    message: string,
    errors?: Record<string, string>[],
    code?: string,
    timestamp?: string
  ) {
    super(message, 401, errors, code, timestamp);
  }
}

class UnauthorizedError extends ApiError {
  // authenticated, without permissions to do
  constructor(
    message: string,
    errors?: Record<string, string>[],
    code?: string,
    timestamp?: string
  ) {
    super(message, 403, errors, code, timestamp);
  }
}

class NotFoundError extends ApiError {
  constructor(
    message: string,
    errors?: Record<string, string>[],
    code?: string,
    timestamp?: string
  ) {
    super(message, 404, errors, code, timestamp);
  }
}

class ConflictError extends ApiError {
  // when the db resource don't have the props passed
  // sell: 2, props have 1
  constructor(
    message: string,
    errors?: Record<string, string>[],
    code?: string,
    timestamp?: string
  ) {
    super(message, 409, errors, code, timestamp);
  }
}

class AlreadyExistError extends ApiError {
  constructor(
    message: string,
    errors?: Record<string, string>[],
    code?: string,
    timestamp?: string
  ) {
    super(message, 422, errors, code, timestamp);
  }
}

class InternalError extends ApiError {
  constructor(
    message: string,
    errors?: Record<string, string>[],
    code?: string,
    timestamp?: string
  ) {
    super(message, 500, errors, code, timestamp);
  }
}

export {
  AlreadyExistError,
  BadRequestError,
  ConflictError,
  InternalError,
  NotAuthenticatedError,
  NotFoundError,
  NotModifiedError,
  UnauthorizedError,
};

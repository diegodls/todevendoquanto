export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string>;
  public readonly appCode?: string;
  public readonly timestamp?: string;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string>,
    appCode?: string,
    timestamp?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.appCode = appCode;
    this.timestamp = timestamp;
  }
}

export class NotModifiedError extends ApiError {
  // when a requisition is OK but nothing was modified
  // no need to return/retrieve new/same data
  constructor() {
    super('', 304, {});
  }
}

export class BadRequestError extends ApiError {
  constructor(
    message: string,
    errors?: Record<string, string>,
    appCode?: string,
  ) {
    super(message, 400, errors, appCode);
  }
}

export class NotAuthenticatedError extends ApiError {
  // not authenticated
  constructor(
    message: string,
    errors?: Record<string, string>,
    appCode?: string,
  ) {
    super(message, 401, errors, appCode);
  }
}

export class UnauthorizedError extends ApiError {
  // authenticated, without permissions to do
  constructor(
    message: string,
    errors?: Record<string, string>,
    appCode?: string,
  ) {
    super(message, 403, errors, appCode);
  }
}

export class NotFoundError extends ApiError {
  constructor(
    message: string,
    errors?: Record<string, string>,
    appCode?: string,
  ) {
    super(message, 404, errors, appCode);
  }
}

export class ConflictError extends ApiError {
  // when the db resource don't have the props passed
  // sell: 2, props have 1
  constructor(
    message: string,
    errors?: Record<string, string>,
    appCode?: string,
  ) {
    super(message, 409, errors, appCode);
  }
}

export class AlreadyExistError extends ApiError {
  constructor(
    message: string,
    errors?: Record<string, string>,
    appCode?: string,
  ) {
    super(message, 422, errors, appCode);
  }
}

export class InternalError extends ApiError {
  constructor(
    message: string,
    errors?: Record<string, string>,
    appCode?: string,
  ) {
    super(message, 500, errors, appCode);
  }
}

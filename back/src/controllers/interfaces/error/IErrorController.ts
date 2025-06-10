import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";

type ErrorDTOWhere = "controller" | "service";

interface ErrorDTO {
  where: ErrorDTOWhere;
}

interface IErrorController {
  handle(request: HttpRequest<ErrorDTO>): HttpResponse | void;
}

export { ErrorDTO, ErrorDTOWhere, IErrorController };

import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

type ErrorDTOWhere = "controller" | "service";

interface ErrorDTO {
  where: ErrorDTOWhere;
}

interface IErrorController {
  handle(request: PublicHttpRequest<ErrorDTO>): PublicHttpResponse | void;
}

export { ErrorDTO, ErrorDTOWhere, IErrorController };

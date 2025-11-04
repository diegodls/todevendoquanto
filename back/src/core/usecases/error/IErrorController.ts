import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

export type ErrorDTOWhere = "controller" | "service";

export interface ErrorDTO {
  where: ErrorDTOWhere;
}

export interface IErrorController {
  handle(request: PublicHttpRequest<ErrorDTO>): PublicHttpResponse | void;
}

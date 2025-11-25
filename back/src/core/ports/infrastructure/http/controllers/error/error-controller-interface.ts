import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

export type ErrorDTOWhereType = "controller" | "service";

export interface ApiErrorInputDTO {
  where: ErrorDTOWhereType;
}

export interface ApiErrorOutputDTO {
  where: ErrorDTOWhereType;
}

export interface ErrorControllerInterface {
  handle(
    request: AuthenticatedHttpRequestInterface<ApiErrorInputDTO>
  ): Promise<AuthenticatedHttpResponseInterface<ApiErrorOutputDTO>>;
}

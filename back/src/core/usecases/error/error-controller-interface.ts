import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

export type ErrorDTOWhereType = "controller" | "service";

export interface ErrorDTOInterface {
  where: ErrorDTOWhereType;
}

export interface ErrorControllerInterface {
  handle(
    request: PublicHttpRequestInterface<ErrorDTOInterface>
  ): PublicHttpResponseInterface | void;
}

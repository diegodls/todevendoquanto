import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

export type TestControllerOutputDTO = {
  message: string;
};

export interface TestControllerInterface {
  handle(
    request: AuthenticatedHttpRequestInterface
  ): Promise<AuthenticatedHttpResponseInterface<TestControllerOutputDTO>>;
}

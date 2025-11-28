import {
  TestControllerInterface,
  TestControllerOutputDTO,
} from "@/core/ports/infrastructure/http/controllers/api/test-controller-interface";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

export class TestController implements TestControllerInterface {
  public async handle(
    _request: AuthenticatedHttpRequestInterface
  ): Promise<AuthenticatedHttpResponseInterface<TestControllerOutputDTO>> {
    console.log("");
    console.log("🔴🔴🔴 CONTROLLER TEST ROUTE 🔴🔴🔴");
    console.log("");

    const output: AuthenticatedHttpResponseInterface<TestControllerOutputDTO> =
      {
        body: { message: "CONTROLLER TEST ROUTE" },
        statusCode: 200,
      };

    return output;
  }
}

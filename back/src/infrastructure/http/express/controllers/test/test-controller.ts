import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { TestControllerInterface } from "@/core/usecases/test/test-controller-interface";

export class TestController implements TestControllerInterface {
  public async handle(
    request: PublicHttpRequestInterface
  ): Promise<PublicHttpResponseInterface> {
    console.log("");
    console.log("🔴🔴🔴 CONTROLLER TEST ROUTE 🔴🔴🔴");
    console.log("");

    return { body: { message: "CONTROLLER TEST ROUTE" }, statusCode: 200 };
  }
}

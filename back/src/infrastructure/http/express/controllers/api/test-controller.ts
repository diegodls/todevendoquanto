import { TestControllerInterface } from "@/core/ports/infrastructure/http/controllers/test/test-controller-interface";
import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

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

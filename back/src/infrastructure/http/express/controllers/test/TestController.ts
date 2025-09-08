import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { ITestController } from "@/core/usecases/test/ITestController";

export class TestController implements ITestController {
  public async handle(request: PublicHttpRequest): Promise<PublicHttpResponse> {
    console.log("");
    console.log("🔴🔴🔴 CONTROLLER TEST ROUTE 🔴🔴🔴");
    console.log("");

    return { body: { message: "CONTROLLER TEST ROUTE" }, statusCode: 200 };
  }
}

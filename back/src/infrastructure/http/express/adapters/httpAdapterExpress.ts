import {
  HttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { Request, Response } from "express";

const httpAdapterExpress = (controller: any) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      headers: request.headers,
      params: request.params,
      query: request.query,
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

export { httpAdapterExpress };

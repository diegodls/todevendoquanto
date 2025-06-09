import { Request, Response } from "express";

import { HttpRequest, HttpResponse } from "../../types/HttpRequestResponse";

const httpAdapterExpress = (controller: any) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

export { httpAdapterExpress };

import { Request, Response } from "express";

import { HttpRequest, HttpResponse } from "../../types/https";

export const expressAdapter = (controller: any) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

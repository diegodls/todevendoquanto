import { Request, Response, Router } from "express";

const router = Router();

router.post("/users", (request: Request, response: Response) => {
  response.status(201).send();
});

export { router };

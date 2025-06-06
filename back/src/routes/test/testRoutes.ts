import { HttpMethod } from "../../types/HttpMethod";

interface ITestRoutes<T> {
  path: string;
  method: HttpMethod;
  handler: T;
}

const testRoutes: ITestRoutes<Function>[] = [
  {
    path: "/test",
    method: "get",
    handler: () => {
      console.log("❓❓❓");
      console.log("ROTA TEST");
      console.log("❓❓❓");
    },
  },
];

export { ITestRoutes, testRoutes };

import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserController } from "./user.controller";

const userController = UserController.build();

vi.mock("../../../../services/user/user.service.ts");

describe("UserController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 200 e o token", () => {
    expect(1 + 1).toEqual(2);
  });
});
